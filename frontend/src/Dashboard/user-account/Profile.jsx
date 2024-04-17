import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadImageToCloudinary from '../../utils/uploadCloudinary'
import { BASE_URL,token } from '../../config'
import {toast} from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'

const Profile = ({user}) => {

    const [SelectedFile,setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  
    const [formData, setFormData] = useState({
      name:'',
      email:'',
      password:'',
      photo:null,
      gender:'',
      bloodType:'',
     });
  
     const navigate = useNavigate()

     useEffect(() => {
        setFormData({ name:user.name, email:user.email, photo:user.photo, gender:user.gender, bloodType:user.bloodType});
     }, [user]);
  
     const handleInputChange = e=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    };
  
    const handleFileInputChange = async (event) => {
      const file = event.target.files[0]
  
      const data = await uploadImageToCloudinary(file)
  
      setSelectedFile(data.url)
      setFormData({...formData, photo:data.url})
      
      console.log(file)
    };
  
    const submitHandler = async event=>{
      event.preventDefault();
      setLoading(true)
  
      try{
          const res = await fetch(`${BASE_URL}/users/${user._id}`,{
            method:'put',
            headers :{
              'Content-Type':'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          })
  
          const {message} = await res.json()
  
          if(!res.ok) {
            throw new Error(message)
          }
  
          setLoading(false)
          toast.success(message)
          navigate('/users/profile/me')
  
      }catch(err) {
         toast.error(err.message)
         setLoading(false)
      }
  
    }

  return <div className='mt-10'>
        <form onSubmit={submitHandler}>
          <div className="mb-5">
                <input type='text' 
                placeholder="Full name" 
                name='name' 
                value={formData.name}
                onChange={handleInputChange}
                 className=" mt-6 w-full p-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                 focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor
                 "
                 required />
              </div>
              <div className="mb-5">
                <input type='email' placeholder="Enter your Email" name='email' value={formData.email}
                onChange={handleInputChange}
                 className="w-full p-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                 focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor
                 "
                 aria-readonly
                 readOnly />
              </div>
              <div className="mb-5">
                <input type='password' placeholder="Password" name='password' value={formData.password}
                onChange={handleInputChange}
                 className="w-full p-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                 focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor
                 "
                />
              </div>
              <div className="mb-5">
                <input type='text' placeholder="Blood Group" name='bloodType' value={formData.bloodType}
                onChange={handleInputChange}
                 className="w-full p-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none 
                 focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor
                 "
                 required />
              </div>

              <div className="mt-7">
<button disabled={loading && true} type='submit' className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
  { loading ? <HashLoader size={25} color="#ffffff" /> : 'Update'}
  </button>
</div>

  </form>
    </div>
}

export default Profile