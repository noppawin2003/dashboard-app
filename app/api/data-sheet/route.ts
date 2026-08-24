import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaign =
      searchParams.get("campaign") || "U25";

    const { data, error } = await supabase
      .from("campaign")
      .select("*")
      .eq("campaign", campaign)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error("GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาด",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      time,
      campaign,
      spend,
      gmv,
      orders,
    } = body;

    // ตรวจสอบข้อมูล
    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: "กรุณาเลือกวันที่",
        },
        { status: 400 }
      );
    }

    if (!["11:30", "16:00"].includes(time)) {
      return NextResponse.json(
        {
          success: false,
          error: "เวลาต้องเป็น 11:30 หรือ 16:00",
        },
        { status: 400 }
      );
    }

    // ตอนนี้ทดลอง U25 ก่อน
    if (campaign !== "U25") {
      return NextResponse.json(
        {
          success: false,
          error: "ตอนนี้ระบบรองรับเฉพาะ U25",
        },
        { status: 400 }
      );
    }

    const spendValue = Number(spend);
    const gmvValue = Number(gmv);
    const ordersValue = Number(orders);

    if (
      !Number.isFinite(spendValue) ||
      !Number.isFinite(gmvValue) ||
      !Number.isFinite(ordersValue)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ข้อมูลตัวเลขไม่ถูกต้อง",
        },
        { status: 400 }
      );
    }

    if (
      spendValue < 0 ||
      gmvValue < 0 ||
      ordersValue < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ตัวเลขต้องไม่ติดลบ",
        },
        { status: 400 }
      );
    }

    if (ordersValue === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "order ต้องมากกว่า 0",
        },
        { status: 400 }
      );
    }

    // บันทึกลง Supabase
    const { data, error } = await supabase
      .from("campaign")
      .insert({
        date,
        time,
        campaign,
        product: null,
        gmv: gmvValue,
        spend: spendValue,
        orders: ordersValue,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase INSERT error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    // คำนวณ KPI
    const cpa =
      ordersValue > 0
        ? spendValue / ordersValue
        : 0;

    const adsPercent =
      gmvValue > 0
        ? (spendValue / gmvValue) * 100
        : 0;

    const roas =
      spendValue > 0
        ? gmvValue / spendValue
        : 0;

    const averageBill =
      ordersValue > 0
        ? gmvValue / ordersValue
        : 0;

    // ส่งข้อมูลไป Google Sheets
    const googleSheetsUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    let googleSheets = null;

    if (googleSheetsUrl) {
      try {
        const googleResponse = await fetch(
          googleSheetsUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data.id,
              date: data.date,
              time: data.time,
              campaign: data.campaign,
              spend: spendValue,
              gmv: gmvValue,
              orders: ordersValue,
              cpa,
              adsPercent,
              roas,
              averageBill,
            }),
          }
        );

        googleSheets =
          await googleResponse.json();
      } catch (googleError) {
        console.error(
          "Google Sheets sync error:",
          googleError
        );

        googleSheets = {
          success: false,
          error: "ส่ง Google Sheets ไม่สำเร็จ",
        };
      }
    }

    return NextResponse.json({
      success: true,

      data,

      kpi: {
        spend: spendValue,
        cpa,
        gmv: gmvValue,
        adsPercent,
        roas,
        orders: ordersValue,
        averageBill,
      },

      googleSheets,
    });
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาด",
      },
      { status: 500 }
    );
  }
}