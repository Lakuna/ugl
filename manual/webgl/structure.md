# WebGL Program Structure
A typical WebGL program follows this structure:
- At initialization time:
	- Create all shaders and shader programs, and look up locations.
	- Create buffers and upload vertex data.
	- Create a VAO for each thing you want to draw.
		- For each attribute call `gl.bindBuffer`, `gl.enableVertexAttribArray`, and `gl.vertexAttribPointer`.
		- Bind any indices to the `ELEMENT_ARRAY_BUFFER`.
	- Create textures and upload texture data.
- At render time:
	- Clear and set the viewport and other global state.
	- For each thing you want to draw:
		- Call `gl.useProgram` for the program needed to draw.
		- Bind the VAO for that thing (`gl.bindVertexArray`).
		- Setup uniforms for the thing you want to draw.
			- Call `gl.uniform[1234][uif][v]` for each uniform.
			- Call `gl.activeTexture` and `gl.bindTexture` to assign textures to texture units.
		- Call `gl.drawArrays` or `gl.drawElements`.
