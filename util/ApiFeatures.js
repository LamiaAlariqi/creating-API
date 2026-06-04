class ApiFeatures {
    // هذا الكلاس يستخدم لتحسين استعلامات البحث في قاعدة البيانات، مثل البحث، التصفية، الترتيب، والتقسيم إلى صفحات
    //qrystr هو الكائن الذي يحتوي على معايير البحث (مثل req.query)
    constructor(query, queryStr) {
        this.query = query; // هذا هو الاستعلام الأساسي (مثل User.find())
        this.queryStr = queryStr; // هذا هو الكائن الذي يحتوي على معايير البحث (مثل req.query)
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                title: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                    // $regex يعني أن البحث سيكون باستخدام تعبير عادي (regular expression)، و $options: "i" يعني أن البحث سيكون غير حساس لحالة الأحرف (case-insensitive)
                }
            }
            : {};
        this.query = this.query.find({ ...keyword }); // دمج معايير البحث مع الاستعلام الأساسي
        return this; // إرجاع الكائن نفسه لتمكين التتابع (chaining)
    }
    filter() {
        const queryStrCopy = { ...this.queryStr };

        // 1. إزالة الحقول التي لا نحتاجها في الفلترة
        const removeItems = ["keyword", "page", "limit"];
        removeItems.forEach((item) => delete queryStrCopy[item]);

        // 2. الفلترة المتقدمة للسعر والتقييمات (gt, gte, lt, lte)
        let queryStr = JSON.stringify(queryStrCopy);

        // تحويل الكلمات إلى صيغة MongoDB بإضافة $
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        // تحديث البحث
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination() {
        // productsPerPage هو عدد المنتجات التي نريد عرضها في كل صفحة
        let productsPerPage = 10;
        // currentPage هو الصفحة الحالية، وإذا لم يتم تحديده في queryStr، سيتم افتراض أنه الصفحة الأولى
        const currentPage = this.queryStr.page || 1
        // skip هو عدد المنتجات التي يجب تخطيها للوصول إلى الصفحة الحالية
        const skip = productsPerPage * (currentPage - 1);
        // هذا يعني أنه إذا كنا في الصفحة الأولى، فلن يتم تخطي أي منتجات (skip = 0)، وإذا كنا في الصفحة الثانية، فسيتم تخطي 5 منتجات (skip = 5)، وهكذا.
        this.query = this.query.limit(productsPerPage).skip(skip);
        //         . كيف يعمل مع الـ skip؟ (المعادلة الحسابية)
        // الـ limit والـ skip يعملان معاً مثل "عدسة المكبر":

        // في الصفحة الأولى (currentPage = 1):

        // skip = 5 * (1 - 1) = 0 (لا تتخطى شيء).

        // limit(5) (هات أول 5 منتجات).

        // في الصفحة الثانية (currentPage = 2):

        // skip = 5 * (2 - 1) = 5 (تخطى أول 5 منتجات).

        // limit(5) (هات الـ 5 التي تليها).
        // إرجاع الكائن نفسه لتمكين التتابع (chaining)
        return this
    }
}
export default ApiFeatures;