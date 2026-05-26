import { NextResponse } from "next/server"
import connectDB from "../../../utils/database"
import { UserModel } from "../../../utils/schemaModels"

export async function GET(request){
    try{
        await connectDB()
        // URLからemail取得
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email")
        // user検索
        const user = await UserModel.findOne({
            email: email
        })
        // userなし
        if(!user){
            return NextResponse.json({
                message: "ユーザーなし"
            })
        }
        // 名前返却
        return NextResponse.json({
            name: user.name
        })
    }catch{
        return NextResponse.json({
            message: "取得失敗"
        })
    }
}