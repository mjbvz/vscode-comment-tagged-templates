const x = /* wgsl */`
fn prng( p: f32 ) -> f32 {
	return f32( pcg( u32( p ) ) ) / f32( u32( 0xffffffff ) );
}
`;

const y = /* wgsl */`
struct Uniforms {
	uvTransform: mat3x3<f32>,
};
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Varyings {
	@location(0) vUv: vec2f,
};

fn main() {
	let pos: vec2f = vUv + vec2f( 0.5 );
	let pos3d: vec3f = vec3f( vUv, 0. ) * uniforms.uvTransform;
}
`;