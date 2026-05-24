const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/analyze", async (req, res) => {

    const { meal } = req.body;

    if (!meal || meal.trim() === "") {
        return res.json({ success: false, message: "Please enter your meal" });
    }

    const text = meal.toLowerCase();

    try {
        const response = await axios.get(
            "https://api.calorieninjas.com/v1/nutrition",
            {
                params: { query: text },
                headers: {
                    "X-Api-Key": process.env.CALORIE_NINJAS_API_KEY
                }
            }
        );

        const foods = response.data.items;
        let totalCalories = 0;

        if (foods && foods.length > 0) {
            foods.forEach(food => {
                totalCalories += food.calories;
            });
            totalCalories = Math.round(totalCalories);
        } else {
            // Fallback agar API kuch nahi pehchane
            totalCalories = 300;
        }

        // INTENSITY LOGIC — same as before
        let intensity = "";
        let extraWorkout = "";

        if (totalCalories < 1500) {
            intensity = "Low";
            extraWorkout = "+10 pushups";
        } else if (totalCalories < 2500) {
            intensity = "Medium";
            extraWorkout = "+20 pushups + 20 squats";
        } else {
            intensity = "High";
            extraWorkout = "+30 pushups + 40 squats + 15 min running";
        }

        res.json({
            success: true,
            calories: totalCalories,
            intensity,
            extraWorkout
        });

    } catch (error) {
        // Fallback to static if API fails
        res.json({
            success: true,
            calories: 300,
            intensity: "Low",
            extraWorkout: "+10 pushups"
        });
    }
});

module.exports = router;