import { NextResponse } from "next/server";
import connectDB from "../../../../utils/database";
import { EnemyModel } from "../../../../utils/schemaModels";

export async function PUT(request, context){
    const reqBody = await request.json()
    try{
        await connectDB()
        const resolvedParams = await context.params
        const singleItem = await EnemyModel.findById(resolvedParams.id)

        await EnemyModel.updateOne({_id: resolvedParams.id}, reqBody)
        return NextResponse.json({message: "敵モブ編集成功"})

    }catch{
        return NextResponse.json({message: "敵モブ編集失敗"})
    }
}