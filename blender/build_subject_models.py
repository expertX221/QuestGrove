import bpy, math, random, os
from mathutils import Vector
random.seed(24)
OUT=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'public','models')
os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(n,c,metal=0,rough=.4):
 m=bpy.data.materials.new(n); m.diffuse_color=(*c,1); m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF'); b.inputs['Base Color'].default_value=(*c,1); b.inputs['Metallic'].default_value=metal; b.inputs['Roughness'].default_value=rough
 return m
gold=mat('Brushed champagne brass',(.55,.36,.13),.78,.24)
stone=mat('Weathered limestone',(.56,.57,.48),0,.8)
green=mat('Forest moss',(.13,.25,.12),0,.85)
violet=mat('Amethyst',(.43,.32,.68),.25,.2)
cream=mat('Ivory paper',(.92,.85,.66),0,.7)
blue=mat('Ocean enamel',(.11,.34,.43),.28,.22)
wood=mat('Walnut',(.18,.09,.045),0,.6)
def finish(o,n,m):
 o.name=n; o.data.materials.append(m)
 if o.type=='MESH':
  for p in o.data.polygons:p.use_smooth=True
 return o
def sphere(n,p,s,m):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=p); o=bpy.context.object; o.scale=s; return finish(o,n,m)
def cube(n,p,s,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p); o=bpy.context.object;o.scale=s;finish(o,n,m)
 bevel=o.modifiers.new('Soft crafted edges','BEVEL');bevel.width=.04;bevel.segments=3
 return o
def rod(n,a,b,r,m):
 a,b=Vector(a),Vector(b);d=b-a;bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=r,depth=d.length,location=(a+b)/2);o=bpy.context.object;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return finish(o,n,m)
def ring(n,p,r,m,rotation=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=10,location=p,major_radius=r,minor_radius=.025,rotation=rotation);return finish(bpy.context.object,n,m)
def clear():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def export(n):
 bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,n+'.blend'))
 bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,n+'.glb'),export_format='GLB')
def base():
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=1.6,depth=.16,location=(0,0,-1.1));finish(bpy.context.object,'Limestone plinth',stone)
 ring('Brass inlay',(0,0,-1),1.5,gold)
# Scientific molecular sculpture, each atom independently named for raycasting.
base()
atoms=[((0,0,0),.44,violet,'Oxygen'),((-.83,.4,.38),.3,cream,'Hydrogen A'),((.83,.4,.38),.3,cream,'Hydrogen B')]
for p,r,m,n in atoms:sphere(n,p,(r,r,r),m)
for p,r,m,n in atoms[1:]:rod('Covalent bond',(0,0,0),p,.065,gold)
rod('Sculpture support',(0,0,-1),(0,0,-.4),.06,gold)
export('science');clear()
# Geometry with vertex spheres and structural edges.
base();verts=[(-.8,-.65,-.75),(.8,-.65,-.75),(.8,.65,-.75),(-.8,.65,-.75),(0,0,1.1)]
for i,p in enumerate(verts):sphere('Vertex '+str(i+1),p,(.07,.07,.07),gold)
for a,b in [(0,1),(1,2),(2,3),(3,0),(0,4),(1,4),(2,4),(3,4)]:rod('Pyramid edge',verts[a],verts[b],.032,gold)
mesh=bpy.data.meshes.new('Crystal faces');mesh.from_pydata(verts,[],[(0,1,4),(1,2,4),(2,3,4),(3,0,4),(0,3,2,1)])
o=bpy.data.objects.new('Square pyramid',mesh);bpy.context.collection.objects.link(o);finish(o,'Square pyramid',violet)
export('mathematics');clear()
# Globe on a full brass stand with land patches and latitude rings.
base();sphere('Earth ocean',(0,0,.1),(.88,.88,.88),blue)
ring('Meridian',(0,0,.1),1.02,gold,(math.pi/2,0,0));rod('Axis',(0,0,-1),(0,0,1.12),.04,gold)
for z in [-.5,0,.5]:ring('Latitude',(0,0,z+.1),math.sqrt(.89**2-z*z),gold)
export('social');clear()
# Actual bound volumes and individually layered pages.
base()
for k,(angle,m) in enumerate([(0,wood),(.3,green),(-.2,violet)]):
 z=-.85+k*.31
 for coverz in [z,z+.25]:
  o=cube('Book cover',(0,0,coverz),(1.65,1.03,.045),m);o.rotation_euler.z=angle
 o=cube('Pages',(0,0,z+.125),(1.55,.94,.2),cream);o.rotation_euler.z=angle
 for j in range(7):
  o=cube('Page edge',(0,-.475,z+.05+j*.025),(1.5,.008,.004),gold);o.rotation_euler.z=angle
export('english');clear()
# Logic puzzle: an exploded interlocking crystal structure.
base()
for x in [-1,1]:
 for y in [-1,1]:
  for z in [-1,1]:cube('Puzzle piece',(.37*x,.37*y,.37*z),(.62,.62,.62),violet if x*y*z>0 else gold)
export('logic');clear()
# Architectural observatory as a usable Blender source model.
base()
bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=1,depth=.65,location=(0,0,-.65));finish(bpy.context.object,'Observatory drum',stone)
for i in range(12):
 a=i*math.tau/12;rod('Dome rib',(math.cos(a),math.sin(a),-.3),(0,0,1.05),.025,gold)
for z,r in [(-.3,1),(.1,.94),(.5,.72),(.8,.43)]:ring('Dome band',(0,0,z),r,gold)
rod('Telescope barrel',(-.55,0,.1),(.6,0,.55),.12,gold);rod('Tripod',(0,0,-.3),(0,0,.3),.04,gold)
export('observatory')
print('EXPORTED six Blender source files and six GLB models')
