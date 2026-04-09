export const sendToken = (user, statusCode, res) => {
    // 1. توليد الـ JWT Token باستخدام الميثود اللي أنشأناها في موديل المستخدم
    const token = user.getJwtToken();

    const option={
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
         // 7 أيام
         //١٠٠٠ ميلي ثانية = 1 ثانية Milliseconds
        httpOnly: true, // هذا الخيار يجعل الكوكي غير قابل للوصول من خلال جافاسكريبت، مما يزيد من الأمان
    }
    // 2. إرسال الكوكي والرد مع الـ Token
    return res.status(statusCode).cookie("token", token, option).json({
        success: true,
        token,
        user
    });
}

// التوكن بيتم عمل لها هاشنج مره ثاني
// فايدة jwt انك تقدر تخزن فيها معلومات زي اليوزر اي دي وتقدر تتحقق منها في كل طلب بدون ما تحتاج تسوي استعلام لقاعدة البيانات في كل مرة، بس لازم تتأكد انك بتستخدمها بشكل صحيح عشان ما تكون عرضة للاختراق.