const BINURL = "https://b.mmpc.me"
const SIZELIMIT = 1024 * 1024 * 25 // 25MB

function addFile(binurl, filename) {
  const a = document.createElement("a")
  a.href = binurl
  a.innerText = filename || binurl
  document.getElementById("filelist").appendChild(a)
  clipboard(a.href)
}
const upload = (body, contentType, fileName, binType = "b") =>
  fetch(`${BINURL}/${binType}`, {
    method: "POST", headers: { "Content-Type": contentType, "File-Name": fileName }, body
  })
    .then(async (res) => {
      const binName = await res.text()
      addFile(`${BINURL}/${binType}/${binName}`, binName)
    })
    .catch((err) => console.error(err))
const uploadText = () => upload(document.getElementById("upload_body").value, "text/plain", "text.txt")
const setUrl = () => upload(document.getElementById("dest").value, "", "", "u")
const uploadFile = (file) => upload(file, file.type, file.name)
const fileHandler = (files) => [...files].forEach((file) => {
    if (file.size > SIZELIMIT) alert(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
    uploadFile(file)
  })
const dropHandler = (e) => {
  e.preventDefault()
  fileHandler(e.dataTransfer.files)
};
const chooseHandler = (e) => fileHandler(e.target.files)
const dragOverHandler = (e) => e.preventDefault()
const clipboard = (str) => navigator.clipboard.writeText(str)