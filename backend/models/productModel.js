const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Product name"]
    },
    description:{
        type:String,
        required:[true, "Please enter the product description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter the product price"],
        maxLength:[8,"Price cannot exceed 8 char"]
    },
    ratings:{
        type:Number,
        default:0
    },
    brand:{
        type:String,
        required:[true, "Please enter the product brand"]
    },
    size_of_instrument:{
        type: [String],
        default: []
    },
    stage:{
        type:String,
        default:"all stage"
    },
    condition:{
        type:String,
    },
    varieties:{
        type: [String],
        default: []
    },
    specific_feature:{
        type:String,
    },
    packaging_dimensions:{
        type:String,
    },
    mode_of_administration: {
        type: String,
    },
    caution:{
        type:String,
    },
    material_used:{
        type: String,
        required:true
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter product stock"],
        maxLength:[10,"Stock cannot exceed 4 characters"],
        default:1
    },
    color:[
        {
            type:String,
        }
    ],
    model_number:{
        type:String
    },
    weight_of_the_commodity:{
        type:String
    },
    shelflife:{
        type:Number,
    },
    guarantee:{
        type:Number
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
            },
            comment:{
                type:String,
            }

        }
    ],
    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    animal:{
        type:ObjectId,
        ref:"Animal",
        required:true
    },
    treatment:{
        type:ObjectId,
        ref:"Treatment",
        required:false

    },
    dailyEssential:{
        type:ObjectId,
        ref:"Essential",
        required:false

    },
    medicalCare:{
        type:ObjectId,
        ref:"Medical",
        required:false

    },
    faqs: [
        {
           question:{
            type:String,
           },
           answer:{
            type:String
           }
        },
      ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", ProductSchema);
