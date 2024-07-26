import { auth, storage, ref, uploadBytes, getDownloadURL, db, collection, addDoc, getDocs } from "../utils/utils.js";

console.log('Script loaded');
console.log('auth', auth);

let upload_img_btn = document.getElementById('upload_img_btn');
let inpFile = document.getElementById('inp_file');

upload_img_btn.addEventListener('click', uploadProfile);

function uploadProfile() {
    alert('Uploading image...');
    const file = inpFile.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }

    const imgRef = ref(storage, `profileimg/${file.name}`);
    uploadBytes(imgRef, file)
        .then(() => {
            console.log('File is uploaded');
            return getDownloadURL(imgRef);
        })
        .then((url) => {
            console.log('URL obtained:', url);
            const eventInfo = {
                profileimg: file.name,
                banner: url
            };
            const eventCollection = collection(db, "profileimg");
            return addDoc(eventCollection, eventInfo);
        })
        .then((snapshot) => {
            console.log('Document added:', snapshot.id);
            // Optionally redirect or update UI here
            // window.location.href = '/';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

let container2 = document.getElementById('container2');

getEvents();

async function getEvents() {
    if (!container2) {
        console.error("Container element not found.");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "profileimg"));
        let html = ''; // Initialize an empty string to accumulate HTML
        // container2.innerHTML = ''

        querySnapshot.forEach((doc) => {
            let event = doc.data();
            console.log(event);
            let { banner } = event;

            // Construct the HTML for each event
            let ele = `
                <img src="${banner}" 
                    class="w-32 group-hover:w-36 group-hover:h-36 h-32 object-center object-cover rounded-full transition-all duration-500 delay-500 transform">
            `;
            html += ele; // Append each event's HTML to the accumulated string
        });

        container2.innerHTML = html; // Set the innerHTML of container2 after loop
        // window.location.href = '/'
    } catch (error) {
        console.error("Error getting documents: ", error);
        alert(error);
    }
}

