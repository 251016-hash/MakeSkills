import { NextResponse } from "next/server"
import connectDB from "../../../../utils/database"
import { EnemyModel } from "../../../../utils/schemaModels"

export async function DELETE(request, context){
    const reqBody = await request.json()
    try{
        await connectDB()
        const resolvedParams = await context.params
        const singleItem = await EnemyModel.findById(resolvedParams.id)
        
        await EnemyModel.deleteOne({_id: resolvedParams.id})
        return NextResponse.json({message: "敵モブ削除成功"})
    }catch{
        return NextResponse.json({message: "敵モブ削除失敗"})
    }
}