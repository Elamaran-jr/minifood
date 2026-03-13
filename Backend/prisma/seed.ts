import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const southIndianFoods = [
  // === DOSA (15) ===
  { name: "Masala Dosa", description: "Crispy golden crepe made from fermented rice and lentil batter, stuffed with a spiced potato filling. A quintessential South Indian breakfast.", price: 4.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Plain Dosa", description: "Thin, crispy crepe made from fermented rice and urad dal batter. Served with coconut chutney and sambar.", price: 3.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Rava Dosa", description: "Crispy semolina-based dosa with a lace-like texture, flavored with cumin, pepper, and curry leaves.", price: 4.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Mysore Masala Dosa", description: "Dosa smeared with spicy red chutney inside, filled with potato masala, and served with extra coconut chutney.", price: 5.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Onion Dosa", description: "Crispy dosa topped with finely chopped onions and green chilies, giving it an extra crunch and flavor.", price: 4.29, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Ghee Roast Dosa", description: "Extra crispy dosa roasted in pure ghee until golden brown. Rich, buttery, and irresistibly crunchy.", price: 5.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Paper Dosa", description: "Ultra-thin, extra-long crispy dosa that is paper-light and delicate. A showpiece on the plate.", price: 4.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Cheese Dosa", description: "Crispy dosa loaded with melted cheese on top. A fusion twist on the classic South Indian crepe.", price: 5.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Egg Dosa", description: "Classic dosa with a beaten egg spread on top while cooking, creating a protein-rich, savory crepe.", price: 4.79, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Paneer Dosa", description: "Dosa stuffed with spiced crumbled paneer filling, blending North and South Indian flavors.", price: 5.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Neer Dosa", description: "Soft, delicate rice crepes from Mangalore. Light as a feather, served with coconut chutney.", price: 3.99, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Podi Dosa", description: "Dosa sprinkled with spicy gunpowder (podi) and sesame oil, giving it an intense, fiery kick.", price: 4.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Ragi Dosa", description: "Healthy dosa made from finger millet flour, with a slightly earthy flavor. Rich in calcium and iron.", price: 4.29, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Set Dosa", description: "Thick, soft, spongy mini dosas served in a set of three. Perfect for soaking up sambar and chutney.", price: 4.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Spring Dosa", description: "Crispy dosa rolled with a fresh vegetable stuffing, spring-roll style. A creative South Indian fusion dish.", price: 5.49, category: "Dosa", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },

  // === IDLI (10) ===
  { name: "Idli", description: "Soft, fluffy steamed rice cakes made from fermented batter. The ultimate comfort food, served with chutney and sambar.", price: 2.99, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Rava Idli", description: "Quick-to-make steamed cakes from semolina, tempered with mustard seeds, cashews, and curry leaves.", price: 3.49, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Mini Idli with Sambar", description: "Tiny bite-sized idlis swimming in hot, tangy sambar. A popular tiffin-center favorite.", price: 3.99, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Ghee Podi Idli", description: "Steamed idlis tossed in ghee and spicy podi (gunpowder). Aromatic, spicy, and absolutely addictive.", price: 3.99, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Kanchipuram Idli", description: "Temple-style idli seasoned with pepper, cumin, ginger, and ghee. Originating from the temple town of Kanchipuram.", price: 3.99, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Thatte Idli", description: "Large, plate-sized soft idlis from Karnataka. Thin and wide, served with coconut chutney.", price: 3.49, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Stuffed Idli", description: "Soft idlis with a savory potato and onion stuffing inside. A delightful twist on the classic.", price: 4.29, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Ragi Idli", description: "Nutritious idlis made from finger millet flour. Dark in color with an earthy, wholesome taste.", price: 3.49, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Masala Idli Fry", description: "Idlis cut into cubes and stir-fried with onions, bell peppers, and spices. A spicy, crunchy snack.", price: 4.49, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Curd Idli", description: "Soft idlis soaked in seasoned yogurt with a tempering of mustard seeds and curry leaves. Cool and tangy.", price: 3.49, category: "Idli", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },

  // === VADA (8) ===
  { name: "Medu Vada", description: "Crispy on the outside, soft on the inside — these lentil donuts are deep-fried perfection. Served with sambar and chutney.", price: 3.49, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Masala Vada", description: "Spicy, crunchy fritters made from chana dal, onions, curry leaves, and green chilies. A teatime classic.", price: 3.29, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Curd Vada (Dahi Vada)", description: "Soft vadas soaked in creamy, sweet yogurt and topped with tamarind chutney and spice powders.", price: 3.99, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Sambar Vada", description: "Crispy medu vadas dunked in piping hot, tangy sambar. The vadas soak up all the flavor.", price: 3.99, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Onion Pakoda", description: "Crispy, deep-fried onion fritters with gram flour batter. Crunchy, spicy, and perfect with tea.", price: 2.99, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Banana Bajji", description: "Ripe banana slices dipped in spiced gram flour batter and deep-fried until golden. Sweet meets savory.", price: 2.99, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Chilli Bajji", description: "Whole green chilies dipped in besan batter and deep-fried. Fiery, crunchy, and utterly delicious.", price: 2.49, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&h=350&fit=crop", available: true },
  { name: "Bread Bajji", description: "Thick bread slices dipped in spiced gram flour batter and fried until crispy. Served with tomato ketchup.", price: 2.99, category: "Vada", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },

  // === RICE DISHES (15) ===
  { name: "Lemon Rice", description: "Tangy, turmeric-yellow rice tempered with mustard seeds, peanuts, curry leaves, and fresh lemon juice.", price: 4.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Tamarind Rice (Puliyodharai)", description: "Temple-style tangy rice tossed in a rich tamarind paste with peanuts and sesame. A beloved prasadam.", price: 4.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Coconut Rice", description: "Fragrant rice cooked with freshly grated coconut, tempered with urad dal, cashews, and dry red chilies.", price: 4.29, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Curd Rice (Thayir Sadam)", description: "Creamy yogurt rice seasoned with mustard, ginger, and pomegranate. The ultimate South Indian comfort food.", price: 3.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Bisi Bele Bath", description: "A hearty Karnataka-style rice dish with lentils, vegetables, and a special spice paste. Rich and aromatic.", price: 5.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Tomato Rice", description: "Flavorful rice cooked with fresh tomatoes, onions, and a blend of ground spices. Vibrant red and tangy.", price: 4.29, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Vangibath", description: "Karnataka-style brinjal (eggplant) rice with a spicy, tangy masala. Smoky and full of flavor.", price: 4.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Sambar Rice", description: "Comforting rice mixed with hot, tangy sambar loaded with vegetables. A wholesome one-pot meal.", price: 4.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Rasam Rice", description: "Steamed rice drowned in spicy, tangy rasam. Light, warming, and perfect when you need comfort.", price: 3.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Ghee Rice", description: "Basmati rice cooked in aromatic ghee with whole spices — cardamom, cloves, and bay leaves.", price: 4.49, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },
  { name: "Biryani (Ambur Style)", description: "Fragrant rice layered with spiced meat and seeraga samba rice, slow-cooked Ambur-style from Tamil Nadu.", price: 8.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop", available: true },
  { name: "Dindigul Biryani", description: "Famous Tamil Nadu biryani with small-grain seeraga samba rice, cube-cut meat, and a tangy twist.", price: 8.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop", available: true },
  { name: "Hyderabadi Biryani", description: "Dum-cooked aromatic basmati rice layered with tender meat, saffron, and caramelized onions.", price: 9.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop", available: true },
  { name: "Vegetable Biryani", description: "Fragrant basmati rice cooked with mixed vegetables, paneer, and aromatic whole spices.", price: 6.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop", available: true },
  { name: "Pulao", description: "Lightly spiced rice cooked with vegetables and whole spices. Mild, fragrant, and versatile.", price: 4.99, category: "Rice", imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=350&fit=crop", available: true },

  // === CURRIES & GRAVIES (12) ===
  { name: "Sambar", description: "Tangy lentil stew with drumstick, okra, and eggplant, flavored with tamarind and a special sambar powder.", price: 3.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Rasam", description: "Fiery, thin tamarind and tomato soup with black pepper and cumin. A South Indian digestive elixir.", price: 2.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Avial", description: "Kerala-style mixed vegetable curry in a coconut and yogurt gravy, finished with coconut oil.", price: 4.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Kootu", description: "Thick lentil and vegetable curry with freshly ground coconut paste. Hearty, nutritious, and comforting.", price: 4.49, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Poriyal", description: "Dry-sautéed vegetables tempered with mustard, urad dal, and freshly grated coconut. A staple side dish.", price: 3.49, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Chettinad Chicken Curry", description: "Fiery, aromatic chicken curry from Chettinad with freshly ground spices, kalpasi, and star anise.", price: 8.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=350&fit=crop", available: true },
  { name: "Kerala Fish Curry", description: "Tangy, spicy fish curry cooked in a coconut and kokum gravy. A coastal Kerala classic.", price: 7.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Egg Curry", description: "Hard-boiled eggs simmered in a rich, spiced onion-tomato gravy. Simple yet deeply satisfying.", price: 5.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=350&fit=crop", available: true },
  { name: "Mutton Kuzhambu", description: "Slow-cooked mutton in a thick tamarind-based gravy with roasted spices. Tamil Nadu specialty.", price: 9.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=350&fit=crop", available: true },
  { name: "Prawn Masala", description: "Juicy prawns cooked in a spicy coconut masala with curry leaves and tamarind. Coastal delight.", price: 9.49, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Mor Kuzhambu", description: "Tangy buttermilk curry with coconut, tempered with mustard and fenugreek. Cooling summer dish.", price: 3.99, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Vatha Kuzhambu", description: "Intense, tangy tamarind gravy with sundried vegetables. A Tamil Brahmin kitchen masterpiece.", price: 4.49, category: "Curry", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },

  // === UTTAPAM / APPAM (8) ===
  { name: "Onion Uttapam", description: "Thick, fluffy pancake topped with onions, tomatoes, and green chilies. A savory South Indian pancake.", price: 4.29, category: "Uttapam", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Mixed Vegetable Uttapam", description: "Thick dosa pancake loaded with chopped carrots, beans, capsicum, and corn. Colorful and nutritious.", price: 4.49, category: "Uttapam", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Tomato Uttapam", description: "Soft, thick pancake topped generously with fresh diced tomatoes and curry leaves.", price: 3.99, category: "Uttapam", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Appam", description: "Lacy, bowl-shaped rice pancake with crispy edges and a soft, spongy center. A Kerala breakfast staple.", price: 3.99, category: "Appam", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Egg Appam", description: "Classic appam with a fried egg in the center. The crispy lace meets the runny yolk.", price: 4.49, category: "Appam", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Paniyaram", description: "Small, round, crispy-outside-soft-inside dumplings made from dosa batter. Served with chutney.", price: 3.99, category: "Appam", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },
  { name: "Pesarattu", description: "Andhra-style green moong dal dosa. Protein-rich, slightly crispy, and served with ginger chutney.", price: 4.29, category: "Appam", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&h=350&fit=crop", available: true },
  { name: "Idiyappam", description: "Delicate steamed rice noodle nests from Kerala. Light and fluffy, served with coconut milk or curry.", price: 3.99, category: "Appam", imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=350&fit=crop", available: true },

  // === CHUTNEYS & SIDES (8) ===
  { name: "Coconut Chutney", description: "Fresh coconut ground with green chilies and tempered with mustard and urad dal. The essential dosa companion.", price: 1.49, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Tomato Chutney", description: "Tangy, slightly sweet chutney made from roasted tomatoes, red chilies, and tamarind.", price: 1.49, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Onion Chutney", description: "Spicy chutney made from caramelized onions, red chilies, and tamarind. Deep, smoky flavor.", price: 1.49, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Peanut Chutney", description: "Creamy, nutty chutney made from roasted peanuts and red chilies. Rich and addictive.", price: 1.99, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Papadam", description: "Crispy, thin lentil wafers roasted or fried until golden. The perfect crunchy accompaniment.", price: 0.99, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Pickle (Avakkai)", description: "Spicy, tangy raw mango pickle made with mustard and chili powder. An Andhra classic.", price: 1.49, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Raita", description: "Cool yogurt side with cucumber, onion, and a pinch of roasted cumin. Refreshing accompaniment.", price: 1.99, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },
  { name: "Vadagam", description: "Sun-dried spice balls dissolved in hot oil to add an instant burst of flavor to rice dishes.", price: 1.99, category: "Sides", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=350&fit=crop", available: true },

  // === SNACKS (10) ===
  { name: "Murukku", description: "Crunchy, spiral-shaped savory snack made from rice flour and urad dal. Addictively crispy.", price: 2.99, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Mixture", description: "A crunchy medley of fried lentils, peanuts, curry leaves, and sev. The classic South Indian trail mix.", price: 2.99, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Ribbon Pakoda", description: "Thin, ribbon-shaped crispy fritters made from gram flour and rice flour. Melt-in-your-mouth texture.", price: 2.49, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Thattai", description: "Crispy, flat savory crackers with peanuts and curry leaves. A festive South Indian snack.", price: 2.49, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Seedai", description: "Small, round fried rice flour balls — crunchy outside, hollow inside. Often made during festivals.", price: 2.99, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Banana Chips", description: "Thinly sliced raw bananas deep-fried in coconut oil until perfectly crispy. A Kerala specialty.", price: 2.49, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Bonda", description: "Deep-fried potato dumplings coated in gram flour batter. Crispy, golden, and spiced with curry leaves.", price: 2.99, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Samosa", description: "Crispy pastry triangles filled with spiced potato and peas. South Indian version with curry leaf tempering.", price: 2.99, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Vadai Paruppu", description: "Traditional lentil-based crispy rounds, mildly spiced and perfect as a tea-time snack.", price: 2.49, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },
  { name: "Kara Sev", description: "Thin, spicy gram flour noodles, fried until super crispy. The punchier cousin of regular sev.", price: 2.49, category: "Snacks", imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop", available: true },

  // === SWEETS & DESSERTS (10) ===
  { name: "Payasam (Kheer)", description: "Creamy, sweet rice pudding cooked with milk, sugar, cardamom, and garnished with cashews and raisins.", price: 3.99, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Kesari", description: "Bright orange semolina pudding infused with saffron, ghee, and garnished with cashews. Festive and rich.", price: 3.49, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Mysore Pak", description: "Rich, melt-in-your-mouth fudge made from gram flour, ghee, and sugar. A Mysore Royal Palace creation.", price: 3.99, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Gulab Jamun", description: "Soft, spongy milk balls soaked in warm rose-cardamom sugar syrup. Pure indulgence.", price: 3.49, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Jangiri", description: "Pretzel-shaped sweet made from urad dal batter, deep-fried and soaked in sugar syrup. South Indian jalebi.", price: 2.99, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Adhirasam", description: "Traditional rice flour and jaggery sweet, deep-fried then soaked in jaggery syrup. Chewy and aromatic.", price: 2.99, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Palada Pradhaman", description: "Kerala-style rich milk payasam with thin rice flakes, cardamom, and nuts. A festive Onam classic.", price: 4.49, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Paal Poli", description: "Thin, sweet flatbreads soaked in saffron-flavored milk. A Tamil Nadu festive dessert.", price: 3.99, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Unni Appam", description: "Sweet, small rice and jaggery balls fried in ghee. Crispy exterior with a soft, gooey center.", price: 3.49, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },
  { name: "Elaneer Payasam", description: "Refreshing tender coconut water payasam with coconut flesh and milk. Light, elegant Kerala dessert.", price: 4.49, category: "Desserts", imageUrl: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=500&h=350&fit=crop", available: true },

  // === BEVERAGES (4) ===
  { name: "Filter Coffee", description: "Strong, aromatic South Indian coffee brewed in a traditional metal filter, mixed with frothy boiled milk.", price: 2.49, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=350&fit=crop", available: true },
  { name: "Masala Chai", description: "Spiced tea brewed with ginger, cardamom, cloves, and cinnamon. Strong, sweet, and soul-warming.", price: 1.99, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=350&fit=crop", available: true },
  { name: "Buttermilk (Neer Mor)", description: "Cool, spiced buttermilk with ginger, curry leaves, and asafoetida. The ultimate summer cooler.", price: 1.99, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=350&fit=crop", available: true },
  { name: "Rose Milk", description: "Chilled milk infused with rose syrup, lightly sweetened. Pink, fragrant, and refreshingly cold.", price: 2.49, category: "Beverages", imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=350&fit=crop", available: true },
];

async function main() {
  console.log('🍛 Seeding 100 South Indian food items...\n');

  // Clear existing food items
  try { await prisma.cartItem.deleteMany(); } catch (e) {}
  try { await prisma.orderItem.deleteMany(); } catch (e) {}
  try { await prisma.order.deleteMany(); } catch (e) {}
  await prisma.foodItem.deleteMany();
  console.log('🗑️  Cleared existing food items, orders, and order items.\n');

  let count = 0;
  for (const food of southIndianFoods) {
    await prisma.foodItem.create({ data: food });
    count++;
    if (count % 10 === 0) {
      console.log(`   ✅ Seeded ${count}/${southIndianFoods.length} items...`);
    }
  }

  console.log(`\n🎉 Done! Successfully seeded ${count} South Indian food items.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
