import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { EnemyModel } from "../../../utils/schemaModels"

export async function POST(request){

    const reqBody = await request.json()

    try{
        await connectDB()
        await EnemyModel.create(reqBody)
        return NextResponse.json({message: "敵モブ作成成功"})
    }catch{
        return NextResponse.json({message: "敵モブ作成失敗"})
    }
}