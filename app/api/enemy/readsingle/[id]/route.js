import { NextResponse } from "next/server";
import connectDB from "../../../../utils/database";
import { EnemyModel } from "../../../../utils/schemaModels";

export async function GET(request, context){
    try{
        await connectDB()
        const resolvedParams = await context.params
        const singleItem = await EnemyModel.findById(resolvedParams.id)
        return NextResponse.json({message: "敵モブ読み取り成功（シングル）",singleItem: singleItem})
    }catch{
        return NextResponse.json({message: "敵モブ読み取り失敗（シングル）"})
    }
}