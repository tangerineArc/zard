document.querySelector("#downloadBtn").addEventListener("click", () => {
  const fileInput = document.querySelector("#csvFileInput");

  if (!fileInput.files.length) {
    alert("Please upload a CSV file first");
  }

  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.readAsText(file);

  reader.addEventListener("load", (event) => {
    const csvData = event.target.result;
    const vCardOutput = generateVCards(csvData);

    const blob = new Blob([vCardOutput], { type: "text/vcard" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.vcf";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  });
});

function generateVCards(csvData) {
  const rows = csvData.trim().split("\n").slice(1);
  const vCards = [];

  rows.forEach((row) => {
    const [firstName, lastName, email, phone] = row.split(",");

    const fullName = `${firstName} ${lastName}`;
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
EMAIL:${email}
TEL;TYPE=cell:${phone}
END:VCARD`;

    vCards.push(vCard);
  });

  return vCards.join("\n");
}
