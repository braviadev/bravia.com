async function getToken() {
  // 1. Paste your exact details here:
  const clientId = "02cf79be67994e64a3767661b8d4f696";
  const clientSecret = "560e329e37154229bfc89c72b20c0757";
  const code = "AQCuPskiC49p6o0J-AZQ7KybAssmWLpPdyuIMs2Dbj7LaSVSLFy4Z54518TEspcS_8LKYcvzVMvNuGH_qeLG4N_6JtKa3J98lvgdg-m86fWYAFR38JtIvlPx7kQ0CVHeb90v6S38ZMhQxSvGEPm7lw1-vJkc_sLOhhIVmtOX-KdIWLtvvOLLBj0h204Es9-K4jT6Ea7fjbFfMh4cmlC7Nl18T80l7BCjgoP1fkuZHurdihrHWQOA6y4m-n6pzJVw_ckITAUyy4pfIFZs0yPGAECSoINWmmz2"; 

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://127.0.0.1:3000",
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  const data = await response.json();
  console.log("\n\n=== SPOTIFY RESPONSE ===");
  console.log(data);
  console.log("==========================\n\n");
}

getToken();