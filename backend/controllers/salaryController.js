import Salary from "../models/Salary.js";

// Get salary report (all or by month if provided)
export const getMonthlyReport = async (req, res) => {
  try {
    const { month } = req.query; // optional now

    let query = {};
    if (month) {
      query.month = month; // filter if month provided
    }

    const report = await Salary.find();
    res.json({ success: true, items: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
