const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false               //To not provide the password while using find() on the Users model
        },
        confirmPassword: {
            type: String,
            required: true,
            validate: {
                validator: function(elem) {
                    return elem === this.password
                },
                message: "Passwords do not match."
            }
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "active"
        },
        role: {
            type: String,
            enum: ["Super Admin", "Admin", "User"],
            required: true,
        },
        organizationId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        passwordChangedAt: {
            type: Date,
        },
        passwordResetToken:{
            type: String,
        },
        passwordResetExpires: {
            type: Date,
        },

        active:{
            type: Boolean,
            default: true,
        },
    }, 
    { 
        timestamps: true 
    }


);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
} 

userSchema.methods.changePasswordAfterTokenGen = async function(jwtTimestamp) {
    if(this.passwordChangedAt)
    {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
        return jwtTimestamp < changeTimestamp;
    }
    return false;
}


//Creating password reset token for user to reset password using link

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;            //setting passwordResetExpiry to 10 mins from now
    this.passwordResetExpires = Date.now() + 24 * 10 * 60 * 1000;           //setting passwordResetExpiry to 24 hrs from now
    return resetToken;
}




// Update Password Changed At property when user updates his/her password
userSchema.pre("save", async function(next) {
    
    if(!this.isModified("password") || this.isNew)
    {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;                 // Date.now() - 1000 for removing 1 sec delay of creation
    next();
});



module.exports = mongoose.model("User", userSchema);