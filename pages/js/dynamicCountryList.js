const countryArr = document.getElementById("countries");
const stateArr = document.getElementById("state");
const districtArr = document.getElementById("district");
const countryOutput = document.getElementById("country-output");
const stateOutput = document.getElementById("state-output");
const cityOutput = document.getElementById("city-output");



async function showData() {
	const dataArr = await getData("countries");
	const stateList = await getData(`states/${dataArr[0]["country_name"]}`);
	const districtList = await getData(`cities/${stateList[0]["state_name"]}`);
	let option;
	countryOutput.innerText = dataArr[0]["country_name"];
	stateOutput.innerText = stateList[0]["state_name"];
	cityOutput.innerText = districtList[0]["city_name"];
	for (const element of dataArr) {
		option = document.createElement("option");

		option.value = element["country_name"];
		option.text = element["country_name"];
		countryArr.appendChild(option);
	}
	for (const element of stateList) {
		option = document.createElement("option");
		option.value = element["state_name"];
		option.text = element["state_name"];
		stateArr.appendChild(option);
	}
	for (const element of districtList) {
		option = document.createElement("option");
		option.value = element["city_name"];
		option.text = element["city_name"];
		districtArr.appendChild(option);
	}
}
showData();
countryArr.addEventListener("change", async () => {
	const dataArr = await getData(`states/${countryArr.value}`);
	stateArr.innerHTML = "";
	districtArr.innerHTML = "";
	countryOutput.innerText = countryArr.value;
	stateOutput.innerText = stateArr.value;
	cityOutput.innerText = districtArr.value;
	for (const element of dataArr) {
		var option = document.createElement("option");
		option.value = element["state_name"];
		option.text = element["state_name"];
		stateArr.appendChild(option);
	}
});
stateArr.addEventListener("change", async () => {
	const dataArr = await getData(`cities/${stateArr.value}`);
	districtArr.innerHTML = "";
	countryOutput.innerText = countryArr.value;
	stateOutput.innerText = stateArr.value;
	cityOutput.innerText = districtArr.value;
	for (const element of dataArr) {
		var option = document.createElement("option");
		option.value = element["city_name"];
		option.text = element["city_name"];
		districtArr.appendChild(option);
	}
});
districtArr.addEventListener("change", async () => {
	cityOutput.innerText = districtArr.value;
});