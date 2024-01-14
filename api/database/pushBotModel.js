const { model } = require("mongoose");

module.exports = {
  name: "Push Bot Model",
  route: "/api/bot/models/push",
  method: "POST",
  action: async (request, response) => {
    // Gelen datanın formatı şu:
    const exampleData = {
      data: [
        /* Bot Şeması ile aynı */
        { urunId: 1 },
        { urunId: 2 },
      ],
    };

    try {
      for (const data of request.body.data) {
        const existingModel = await model.findOne({ urunId: data.urunId });

        if (existingModel) {
          // Veri zaten var, güncelle
          await model.updateOne({ urunId: data.urunId }, { $set: data });
        } else {
          // Yeni veri oluştur
          await model.create(data);
        }
      }

      response.status(200).json({
        success: true,
        message: "Veri başarıyla güncellendi veya eklendi.",
      });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ success: false, message: "Bir hata oluştu." });
    }
  },
};

// Yeni veri eklemek için endpoint
module.exports.pushNewData = async (newData) => {
  try {
    await model.create(newData);
    console.log("Yeni veri başarıyla eklendi.");
  } catch (error) {
    console.error("Yeni veri eklerken bir hata oluştu:", error);
  }
};
