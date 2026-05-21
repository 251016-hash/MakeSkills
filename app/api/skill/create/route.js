import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { SkillModel } from "../../../utils/schemaModels"

export async function POST(request){

    const reqBody = await request.json()

    try{
        await connectDB()
        await SkillModel.create(reqBody)
        return NextResponse.json({message: "スキル作成成功"})
    }catch{
        return NextResponse.json({message: "スキル作成失敗"})
    }
}