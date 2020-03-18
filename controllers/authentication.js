const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public

// // @desc    Delete transaction
// // @route   DELETE /api/v1/transactions/:id
// // @access  Public
// exports.deleteTransaction = async (req, res, next) => {
//   try {
//     const transaction = await Transaction.findById(req.params.id);

//     if(!transaction) {
//       return res.status(404).json({
//         success: false,
//         error: 'No transaction found'
//       });
//     }

//     await transaction.remove();

//     return res.status(200).json({
//       success: true,
//       data: {}
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: 'Server Error'
//     });
//   }
// }

class Auth {
  async userAuthentication(req, res, next) {
    const { body, query, params } = req;
    const { login, password } = { ...body, ...query, ...params };

    try {
      const authentication = await Registration.find({
        login,
        password: bcrypt.hashSync(password, process.env.PW)
      });

      const { _id, name, secondName, dateOfBirth } = authentication[0];

      jwt.sign({ login, id: _id }, process.env.JWT_KEY, (err, token) => {
        res.status(200).json({
          success: true,
          data: { id: _id, name, secondName, login, dateOfBirth },
          token
        });
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  }

  async registrationNewUser(req, res, next) {
    const { body, query, params } = req;
    try {
      const { login, password, name, secondName, dateOfBirth } = {
        ...body,
        ...query,
        ...params
      };

      const authentication = await Registration.find({ login });

      if (authentication.length)
        return res.status(400).json({
          success: false,
          error: "login alredy exist"
        });

      const registration = await Registration.create({
        login,
        password: bcrypt.hashSync(password, process.env.PW),
        name,
        secondName,
        dateOfBirth
      });

      const { _id } = registration;

      jwt.sign({ login, id: _id }, process.env.JWT_KEY, (err, token) => {
        res.status(200).json({
          success: true,
          data: { id: _id, name, secondName, login, dateOfBirth },
          token
        });
      });

    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);

        return res.status(400).json({
          success: false,
          error: messages
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Server Error"
        });
      }
    }
  }
}

module.exports = new Auth();
