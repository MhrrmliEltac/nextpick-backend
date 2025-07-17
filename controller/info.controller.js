import Info from "../models/businessInfo.model.js";

export const createInfo = async (req, res) => {
  try {
    const { address, phoneNumber, email } = req.body;

    if (!address && !phoneNumber && !email) {
      return res.status(400).json({ message: "Məlumatların hamısın doldurun" });
    }

    const newInfo = new Info({
      address,
      phoneNumber,
      email,
    });

    const savedInfo = await newInfo.save();
    res.status(201).json({ message: "Info uğurla yaradıldı", savedInfo });
  } catch (error) {
    res.status(500).json({ message: "Info yaradıla bilmədi", error });
  }
};

export const getAllInfo = async (req, res) => {
  try {
    const getAllInfo = await Info.find();
    res.status(200).json(getAllInfo);
  } catch (error) {
    res.status(500).json({ message: "Info tapılmadı", error });
  }
};
