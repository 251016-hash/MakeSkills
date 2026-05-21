import { NextResponse } from "next/server";
import connectDB from "../../../../utils/database";
import { SkillModel } from "../../../../utils/schemaModels";

export async function GET(request, context){
    try{
        await connectDB()
        const resolvedParams = await context.params
        const singleItem = await SkillModel.findById(resolvedParams.id)
        return NextResponse.json({message: "スキル読み取り成功（シングル）",singleItem: singleItem})
    }catch{
        return NextResponse.json({message: "スキル読み取り失敗（シングル）"})
    }
}