export class Color extends Array {
	constructor(data = "FFF") {
		if (typeof data == "number") {
			data = [
				((data >> 16)	& 0xFF) / 0xFF,
				((data >> 8)	& 0xFF) / 0xFF,
				(data			& 0xFF) / 0xFF
			];
		} else if (typeof data == "string") {
			if (!data.startsWith("#")) { data = `#${data}`; }
			if (data.length == 4) { data = `#${data[1]}${data[1]}${data[2]}${data[2]}${data[3]}${data[3]}`; }

			data = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data);
			data.shift(); // Remove full string from first index.
			data = data.map((hex) => parseInt(hex, 16) / 0xFF);
		}

		super(...data); // Will error if data is supplied in an invalid format.
		/*
		Valid formats:
		"#FFFFFF" - Hex value string with pound.
		"FFFFFF" - Hex value string.
		"#FFF" - Web-safe hex value string with pound.
		"FFF" - Web-safe hex value string.
		0xFFFFFF - Hex value.
		[1, 1, 1] - RGB percentage value array.
		*/
	}
}