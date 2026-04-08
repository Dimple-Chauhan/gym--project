const express = require("express");
const router = express.Router();   // ✅ THIS LINE WAS MISSING

router.post("/analyze", (req, res) => {

    const { meal } = req.body;
    const text = meal.toLowerCase();

    let calories = 0;

    function getQuantity(food){
        const regex = new RegExp("(\\d+)\\s*" + food);
        const match = text.match(regex);
        return match ? parseInt(match[1]) : (text.includes(food) ? 1 : 0);
    }

    // FOOD DATABASE
    const foodCalories = {
        egg: 70,
        roti: 120,
        rice: 200,
        dal: 180,
        milk: 100,
        banana: 90,
        paneer: 265,
        potato: 150,
        burger: 300,
        pizza: 280,
        "pani puri": 50
    };

    // CALCULATE TOTAL
    for(let food in foodCalories){
        const qty = getQuantity(food);
        calories += qty * foodCalories[food];
    }

    if(calories === 0){
        calories = 300;
    }

    // INTENSITY LOGIC
    let intensity = "";
    let extraWorkout = "";

    if(calories < 1500){
        intensity = "Low";
        extraWorkout = "+10 pushups";
    }
    else if(calories < 2500){
        intensity = "Medium";
        extraWorkout = "+20 pushups + 20 squats";
    }
    else{
        intensity = "High";
        extraWorkout = "+30 pushups + 40 squats + 15 min running";
    }

    res.json({
        success: true,
        calories,
        intensity,
        extraWorkout
    });

});

module.exports = router;   // ✅ ALSO REQUIRED