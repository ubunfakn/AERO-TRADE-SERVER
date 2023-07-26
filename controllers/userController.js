import userModal from "../model/userModal.js";

export const getUserController = async (req, res) => {
    try {
      const {email} = req.body;
      if (email === "") {
        return res.status(204).send({ error: "Email is required" });
      }
      let user = await userModal.findOne({ email });
      user.password=undefined;
      console.log(user)
      res.status(200).send({
        success:true,
        user
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while Login",
        error,
      });
    }
  };

  export const editUserController = async (req,res)=>{
    try {
        console.log(req.body);
        const {
          id,
          name,
          email,
          mobile,
          address,
        } = req.body;
    
        //validation
        if (!id) {
            console.log("Id cannot be changed");
            return res.status(204).send({ error: "Id cannot be changed" });
          }
        if (!name) {
          console.log("Name is required");
          return res.status(204).send({ error: "Name is required" });
        }
        if (!email) {
          console.log("Email is required");
          return res.status(204).send({ error: "Email is required" });
        }
        if (!mobile) {
          console.log("Phone is required");
          return res.status(204).send({ error: "Phone is required" });
        }
        if (!address) {
          console.log("Address is required");
          return res.status(204).send({ error: "Address is required" });
        }
    
        //saving to databse
        const data = {name,address,mobile}
        const user = await userModal.updateOne({_id:id},{$set:data});
        console.log(user);
        user.password = undefined;
    
        //sending response to API
        res.status(200).send({
          success: true,
          message: "User updated successfully",
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while updating",
          error,
        });
      }
  }