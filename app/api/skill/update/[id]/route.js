import { NextResponse } from "next/server";
import connectDB from "../../../../utils/database";
import { SkillModel } from "../../../../utils/schemaModels";

export async function PUT(request, context){
    const reqBody = await request.json()
    try{
        await connectDB()
        const resolvedParams = await context.params
        const singleItem = await SkillModel.findById(resolvedParams.id)

        if(singleItem.email === reqBody.email){
            await SkillModel.updateOne({_id: resolvedParams.id}, reqBody)
            return NextResponse.json({message: "スキル編集成功"})
        }else{
            return NextResponse.json({message: "他の人が作成したスキルです"})
        }
        
    }catch{
        return NextResponse.json({message: "スキル編集失敗"})
    }
}