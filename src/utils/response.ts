export const successResponse = (res: any, code: number, message: string, data?: any) =>{
    return res.status(code).json({
        status: true,
        code,
        message,
        data: data || null
    });
}

export const errorResponse = (res: any, code: number = 400, message: string | any[]) => {
    return res.status(code).json({
        status: false,
        code,
        message
    })
}