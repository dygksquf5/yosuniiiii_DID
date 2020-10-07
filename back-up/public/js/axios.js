const getBtn = document.getElementById("get-btn");
const postBtn = document.getElementById("post-btn");
const schemaId = document.getElementById("pr-data1");



const getData = async () => {

    await axios.get("http://10.0.2.15:3001/api")
    .then(response => console.log(response))

};
  
  


const sendData = async () => {

    await axios.post("http://10.0.2.15:3001/api", schemaId )
    .then(response => console.log(response))
};

getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);