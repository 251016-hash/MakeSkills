import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { EnemyModel } from "../../../utils/schemaModels"

export async function GET(){
    try{
        await connectDB()
        const allItems = await EnemyModel.find()
        return NextResponse.json({message: "敵モブ読み取り成功（オール）", allItems: allItems})
    }catch{
        return NextResponse.json({message: "敵モブ読み取り失敗（オール）"})
    }
}