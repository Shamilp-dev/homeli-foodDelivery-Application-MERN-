const express = require("express");
const router = express.Router();
const FoodItem = require("../models/FoodItems");

// GET all food items
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };

    if (category && category !== "more") {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const foodItems = await FoodItem.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      data: foodItems,
      count: foodItems.length,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch food items",
    });
  }
});

// POST seed sample data
router.post("/seed", async (req, res) => {
  try {
    await FoodItem.deleteMany({});

    const sampleData = [
      //breakfast
      {
        id: "breakfast-1",
        name: "Ragi Dosa",
        price: 45,
        rating: 4.4,
        image: "breakfast/ragidosa.png",
        category: "breakfast",
        description:
          "A wholesome South Indian delight made with nutritious ragi (finger millet) batter, cooked to crisp perfection. Light, earthy, and packed with calcium and fiber — it’s a healthy twist on the classic dosa, best enjoyed with coconut chutney and sambar.",
      },
      {
        id: "breakfast-2",
        name: "Masala Dosa",
        price: 55,
        rating: 4.9,
        image: "breakfast/masaladosa.png",
        category: "breakfast",
        description: "A golden, crispy dosa stuffed with a spiced potato filling, served hot with coconut chutney and tangy sambar. A perfect blend of crunch and flavor — South India’s all-time favorite comfort food!",
      },
      {
        id: "breakfast-3",
        name: "Porotta",
        price: 45,
        rating: 4.9,
        image: "breakfast/porotta.png",
        category: "breakfast",
        description: "Soft, flaky, and golden-layered — Kerala’s favorite bread made with maida and ghee. Perfectly crisp on the outside and fluffy inside, best paired with spicy curries or just enjoyed on its own!",
      },
      {
        id: "breakfast-4",
        name: "Burger",
        price: 65,
        rating: 4.8,
        image: "breakfast/burger.png",
        category: "breakfast",
        description: "Juicy, flavorful, and freshly grilled! A soft bun stacked with a perfectly cooked patty, crisp lettuce, cheese, and sauces that hit all the right notes — a classic treat for every craving",
      },
      {
        id: "breakfast-5",
        name: "Sandwich",
        price: 40,
        rating: 4.4,
        image: "breakfast/sandwich.png",
        category: "breakfast",
        description: "Fresh, tasty, and satisfying! Layers of veggies, cheese, and flavorful spreads packed between perfectly toasted bread — a quick bite that’s both hearty and delicious.",
      },
      {
        id: "breakfast-6",
        name: "Soft Idli",
        price: 45,
        rating: 4.9,
        image: "breakfast/idli.png",
        category: "breakfast",
        description: "Steamed to perfection, these fluffy and melt-in-your-mouth idlis are a South Indian classic. Light, healthy, and served with coconut chutney and sambar for the perfect comfort meal.",
      },

      //lunch
      {
        id: "lunch-1",
        name: "Chicken Biriyani",
        price: 165,
        rating: 4.8,
        image: "lunch/chickenbiriyani.png",
        category: "lunch",
        description: "A fragrant and flavorful feast! Tender chicken pieces cooked with aromatic basmati rice, spices, and herbs — layered to perfection and served with raita for the ultimate biryani experience.",
      },
      {
        id: "lunch-2",
        name: "Meals",
        price: 120,
        rating: 4.6,
        image: "lunch/meals.png",
        category: "lunch",
        description: "A complete and satisfying South Indian thali featuring steamed rice, flavorful curries, sambar, rasam, vegetables, and pickles — a perfect blend of taste, comfort, and tradition in every bite.",
      },
      {
        id: "lunch-3",
        name: "Paneer Butter Masala",
        price: 115,
        rating: 4.3,
        image: "lunch/paneerbuttermasala.png",
        category: "lunch",
        description: "Soft paneer cubes simmered in a creamy, buttery tomato gravy with a touch of spice and sweetness. A royal North Indian favorite that pairs perfectly with naan, roti, or rice.",
      },
      {
        id: "lunch-4",
        name: "Pizza",
        price: 105,
        rating: 4.2,
        image: "lunch/pizza.png",
        category: "lunch",
        description: "Oven-fresh and loaded with flavor! Crispy crust topped with melted cheese, rich tomato sauce, and a variety of delicious toppings — the ultimate treat for every pizza lover.",
      },
      {
        id: "lunch-5",
        name: "Chicken Curry",
        price: 125,
        rating: 4.8,
        image: "lunch/chickencurry.png",
        category: "lunch",
        description: "Succulent chicken pieces cooked in a rich, aromatic gravy with a perfect blend of spices. A comforting classic that pairs beautifully with steamed rice, roti, or naan.",
      },
      {
        id: "lunch-6",
        name: "Fish Curry",
        price: 95,
        rating: 4.9,
        image: "lunch/fishcurry.png",
        category: "lunch",
        description: "Fresh, tender fish simmered in a tangy and spiced coconut-based gravy. Bursting with coastal flavors, it’s a perfect companion to steamed rice or traditional Kerala parotta.",
      },

      //dinner
      {
        id: "dinner-1",
        name: "Grilled Chicken",
        price: 150,
        rating: 4.4,
        image: "dinner/grilledchicken.png",
        category: "dinner",
        description: "Juicy, perfectly grilled chicken served with zesty green chili chutney and creamy mayonnaise. A smoky, flavorful treat that’s perfect as a snack or a hearty meal.",
      },
      {
        id: "dinner-2",
        name: "Fish Curry",
        price: 95,
        rating: 4.9,
        image: "dinner/fishcurry.png",
        category: "dinner",
        description: "Fresh, tender fish simmered in a tangy and spiced coconut-based gravy. Bursting with coastal flavors, it’s a perfect companion to steamed rice or traditional Kerala parotta.",
      },
      {
        id: "dinner-3",
        name: "Chicken Biriyani",
        price: 165,
        rating: 4.8,
        image: "dinner/chickenbiriyani.png",
        category: "dinner",
        description: "A fragrant and flavorful feast! Tender chicken pieces cooked with aromatic basmati rice, spices, and herbs — layered to perfection and served with raita for the ultimate biryani experience.",
      },
      {
        id: "dinner-4",
        name: "Pizza",
        price: 105,
        rating: 4.3,
        image: "dinner/pizza.png",
        category: "dinner",
        description: "Oven-fresh and loaded with flavor! Crispy crust topped with melted cheese, rich tomato sauce, and a variety of delicious toppings — the ultimate treat for every pizza lover.",
      },
      {
        id: "dinner-5",
        name: "Chicken Curry",
        price: 115,
        rating: 4.8,
        image: "dinner/chickencurry.png",
        category: "dinner",
        description: "Succulent chicken pieces cooked in a rich, aromatic gravy with a perfect blend of spices. A comforting classic that pairs beautifully with steamed rice, roti, or naan.",
      },
      {
        id: "dinner-6",
        name: "Mutton Biriyani",
        price: 245,
        rating: 4.6,
        image: "dinner/muttonbiriyani.png",
        category: "dinner",
        description: "Tender, slow-cooked mutton layered with fragrant basmati rice and aromatic spices, creating a flavorful, hearty feast. Served with cooling raita for the ultimate biryani experience.",
      },

      //dessert
      {
        id: "dessert-1",
        name: "Pazham Pori",
        price: 15,
        rating: 4.6,
        image: "dessert/pazhampori.png",
        category: "dessert",
        description: "Ripe banana slices coated in a light, crispy batter and fried to golden perfection. A sweet and crunchy Kerala snack that’s perfect with tea or as a quick indulgence.",
      },
      {
        id: "dessert-2",
        name: "samosa",
        price: 15,
        rating: 4.5,
        image: "dessert/samosa.png",
        category: "dessert",
        description: "Golden, crispy pastry filled with spiced potatoes and peas. A classic snack that’s crunchy on the outside, flavorful on the inside, and perfect with tamarind or mint chutney.",
      },
      {
        id: "dessert-3",
        name: "Juice",
        price: 55,
        rating: 4.5,
        image: "dessert/juice.png",
        category: "dessert",
        description: "Refreshing, natural, and bursting with flavor! Choose from a wide variety of fruits to enjoy a healthy, revitalizing drink made fresh to order.",
      },
      {
        id: "dessert-4",
        name: "Chikku Shake",
        price: 65,
        rating: 4.8,
        image: "dessert/chikkushake.png",
        category: "dessert",
        description: "Creamy, smooth, and naturally sweet! Made with fresh sapodilla (chikoo) blended to perfection, this shake is a refreshing and indulgent treat.",
      },
      {
        id: "dessert-5",
        name: "Gulab Jamun",
        price: 85,
        rating: 4.2,
        image: "dessert/gulabjamun.png",
        category: "dessert",
        description: "Soft, golden dumplings soaked in fragrant sugar syrup. A classic Indian dessert that’s rich, sweet, and utterly irresistible.",
      },
      {
        id: "dessert-6",
        name: "Vanilla Ice Cream",
        price: 70,
        rating: 4.1,
        image: "dessert/vanillaicecream.png",
        category: "dessert",
        description: "Creamy, smooth, and classic! Rich vanilla flavor in every bite — a timeless dessert to cool and delight your taste buds.",
      },
    ];

    await FoodItem.insertMany(sampleData);

    res.json({
      success: true,
      message: "Sample data seeded successfully",
      count: sampleData.length,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to seed data",
    });
  }
});

module.exports = router;
