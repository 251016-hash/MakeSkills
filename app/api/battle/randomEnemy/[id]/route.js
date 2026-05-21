import connectDB from "../../../../utils/database"
import { EnemyModel } from "../../../../utils/schemaModels"

export async function GET(request, {params}) {

    await connectDB()
    const { id } = await params
    const stage = Number(id)
    // 全敵取得
    const enemies = await EnemyModel.find({
        stage: stage
    })

    if (isNaN(stage)) {
        return Response.json(
            { message: "invalid stage" },
            { status: 400 }
        )
    }
    if(enemies.length === 0){
        return Response.json({
            message: "敵がいません"
        })
    }

    // ランダム番号
    const randomIndex =
        Math.floor(Math.random() * enemies.length)

    // ランダム敵
    const randomEnemy = enemies[randomIndex]
    
    return Response.json({
        randomEnemy
    })
}