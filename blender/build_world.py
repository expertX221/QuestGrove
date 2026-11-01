"""Rebuild the web-ready Quest Grove world with Blender 5.x.
Run: blender --background --python blender/build_world.py
All modeled subjects are named with subject_id prefixes for website raycasting.
"""
import bpy, math, random, os, json
from mathutils import Vector
random.seed(36)
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'public','models'); PRE=os.path.join(ROOT,'public','previews')
os.makedirs(OUT,exist_ok=True);os.makedirs(PRE,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version=0
def mat(name,color,metal=0,rough=.65,alpha=1):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,alpha);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*color,alpha);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;b.inputs['Alpha'].default_value=alpha
 if alpha<1:m.surface_render_method='DITHERED'
 return m
rock=[mat('Weathered rock '+str(i),(.25+i*.045,.28+i*.04,.25+i*.035),0,.92) for i in range(5)]
moss=[mat('Moss '+str(i),(.14+i*.025,.22+i*.026,.095+i*.012),0,.93) for i in range(4)]
leaf=[mat('Leaf '+str(i),(.075+i*.022,.15+i*.025,.065+i*.014),0,.8) for i in range(5)]
gold=mat('Aged champagne brass',(.52,.36,.16),.78,.24)
stone=mat('Warm limestone',(.64,.60,.48),0,.85)
ivory=mat('Ivory paper',(.91,.85,.66),0,.76)
wood=mat('Dark walnut',(.19,.105,.045),0,.8)
blue=mat('Ocean enamel',(.13,.32,.36),.22,.27)
glass=mat('Glazed blue glass',(.36,.60,.64),.15,.15,.27)
water=mat('Waterfall',(.43,.71,.73),.15,.25,.68)
purple=mat('Amethyst',(.44,.32,.62),.35,.18)
pink=mat('Blossom',(.62,.40,.54),0,.8)
flower=mat('Golden flowers',(.85,.63,.16),0,.6)
def mesh(n,verts,faces,m):
 d=bpy.data.meshes.new(n);d.from_pydata(verts,[],faces);d.update();o=bpy.data.objects.new(n,d);bpy.context.collection.objects.link(o);o.data.materials.append(m);return o
def finish(o,n,m,smooth=True):
 o.name=n;o.data.materials.append(m)
 if smooth:
  for p in o.data.polygons:p.use_smooth=True
 return o
def sphere(n,p,s,m,segments=16,rings=10):
 vs=[]
 for j in range(rings+1):
  a=math.pi*j/rings
  for i in range(segments):
   b=i*math.tau/segments;vs.append((p[0]+s[0]*math.sin(a)*math.cos(b),p[1]+s[1]*math.sin(a)*math.sin(b),p[2]+s[2]*math.cos(a)))
 fs=[(j*segments+i,j*segments+(i+1)%segments,(j+1)*segments+(i+1)%segments,(j+1)*segments+i) for j in range(rings) for i in range(segments)]
 o=mesh(n,vs,fs,m)
 for f in o.data.polygons:f.use_smooth=True
 return o
def ico(n,p,s,m,sub=1):
 import bmesh
 bm=bmesh.new();bmesh.ops.create_icosphere(bm,subdivisions=sub,radius=1)
 d=bpy.data.meshes.new(n);bm.to_mesh(d);bm.free()
 o=bpy.data.objects.new(n,d);bpy.context.collection.objects.link(o);o.location=p;o.scale=s;o.data.materials.append(m);return o
def rod(n,a,b,r,m,vertices=10):
 a,b=Vector(a),Vector(b);axis=(b-a).normalized();side=axis.cross(Vector((0,0,1)))
 if side.length<.01:side=axis.cross(Vector((0,1,0)))
 side.normalize();up=axis.cross(side);vs=[]
 for pt in [a,b]:
  for i in range(vertices):vs.append(pt+r*(side*math.cos(i*math.tau/vertices)+up*math.sin(i*math.tau/vertices)))
 fs=[(i,(i+1)%vertices,(i+1)%vertices+vertices,i+vertices) for i in range(vertices)]+[tuple(range(vertices-1,-1,-1)),tuple(range(vertices,vertices*2))]
 o=mesh(n,vs,fs,m)
 for f in o.data.polygons:f.use_smooth=True
 return o
def cube(n,p,s,m,bevel=0):
 vs=[(p[0]+x*s[0]/2,p[1]+y*s[1]/2,p[2]+z*s[2]/2) for x,y,z in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
 o=mesh(n,vs,[(0,3,2,1),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7),(4,5,6,7)],m)
 # Object origin is its actual center so local bridge rotations preserve placement.
 for v in o.data.vertices:v.co-=Vector(p)
 o.location=p
 if bevel:
  mo=o.modifiers.new('Worn edges','BEVEL');mo.width=bevel;mo.segments=2
 return o
def cylinder(n,p,r,depth,m):
 return rod(n,(p[0],p[1],p[2]-depth/2),(p[0],p[1],p[2]+depth/2),r,m,48)
def ring(n,p,r,m,rotation=(0,0,0),thick=.018):
 from mathutils import Euler
 rot=Euler(rotation).to_matrix();vs=[];N=48;K=6
 for i in range(N):
  a=i*math.tau/N
  for j in range(K):
   b=j*math.tau/K;v=Vector(((r+thick*math.cos(b))*math.cos(a),(r+thick*math.cos(b))*math.sin(a),thick*math.sin(b)));vs.append(Vector(p)+rot@v)
 fs=[(i*K+j,((i+1)%N)*K+j,((i+1)%N)*K+(j+1)%K,i*K+(j+1)%K) for i in range(N) for j in range(K)]
 o=mesh(n,vs,fs,m)
 for f in o.data.polygons:f.use_smooth=True
 return o
def tree(prefix,x,y,z,h=1.25,blossom=False):
 rod(prefix+'_tree_trunk',(x,y,z),(x+.04,y,z+h*.72),h*.035,wood)
 for k in range(5):
  a=k*math.tau/5+.3;r=h*.25
  tip=(x+math.cos(a)*r,y+math.sin(a)*r,z+h*(.7+random.random()*.15))
  rod(prefix+'_branch',(x,y,z+h*.45),tip,h*.014,wood,6)
  for j in range(3):
   c=Vector(tip)+Vector((random.uniform(-.18,.18),random.uniform(-.18,.18),random.uniform(-.1,.2)))
   ico(prefix+'_foliage',c,(h*.25,h*.22,h*.20),pink if blossom else random.choice(leaf),2)
def island(s,x,y,z,r=1.6):
 # Irregular radial strata taper into a suspended stone base.
 N=32;vs=[]
 for k,(factor,drop) in enumerate([(1,0),(1.03,-.22),(.94,-.64),(.65,-1.25),(.20,-2.0)]):
  for i in range(N):
   a=i*math.tau/N;rr=r*factor*(1+random.uniform(-.10,.1));vs.append((x+rr*math.cos(a),y+rr*math.sin(a),z+drop+random.uniform(-.08,.06)))
 faces=[]
 for k in range(4):
  for i in range(N):
   a=k*N+i;b=k*N+(i+1)%N;c=(k+1)*N+(i+1)%N;d=(k+1)*N+i;faces.extend([(a,b,c),(a,c,d)])
 faces.append(tuple(range(N-1,-1,-1)));faces.append(tuple(4*N+i for i in range(N)))
 o=mesh(s+'_island_rock',vs,faces,rock[0]);[o.data.materials.append(m) for m in rock[1:]]
 for p in o.data.polygons:p.material_index=random.randrange(5)
 sphere(s+'_moss_ground',(x,y,z+.015),(r*.98,r*.94,.13),moss[1],32,12)
 # Border stone texture, moss clumps, plants, and vertical ivy.
 for i in range(34):
  a=i*math.tau/34;rr=r*random.uniform(.78,.99);px=x+rr*math.cos(a);py=y+rr*math.sin(a)
  ico(s+'_border_stone',(px,py,z+.015),(random.uniform(.10,.24),.13,.12),random.choice(rock),1)
  sphere(s+'_moss_clump',(px,py,z+.09),(.20,.15,.10),random.choice(moss),10,6)
  if i%3==0:
   for j in range(4):
    zz=z-.16-j*.17
    sphere(s+'_trailing_ivy',(px+random.uniform(-.06,.06),py+random.uniform(-.06,.06),zz),(.08,.06,.12),random.choice(leaf),8,5)
  if i%4==0:
   for j in range(3):
    rod(s+'_plant_stem',(px,py,z+.12),(px+.03*j,py,z+.32+.03*j),.008,leaf[1],5)
    sphere(s+'_flower',(px+.03*j,py,z+.33+.03*j),(.025,.025,.025),flower,8,5)
 for a in [.5,2.5,3.5]:tree(s,x+math.cos(a)*r*.7,y+math.sin(a)*r*.7,z+.12,random.uniform(.8,1.1),s=='english')
 # Waterfall ribbons sit off the exposed cliff, not through structures.
 for j in range(5):
  px=x-r*.5+j*.045;py=y-r*.83
  pts=[(px,py,z+.06),(px,py-.06,z-.25),(px+.04,py-.11,z-.8),(px+.12,py-.16,z-1.5),(px+.16,py-.18,z-2.1)]
  for a,b in zip(pts,pts[1:]):rod(s+'_waterfall',a,b,.018+j*.004,water,6)
 return (x,y,z)
isles={
 'mathematics':island('mathematics',-4.3,1.4,1.1,1.8),
 'science':island('science',2.2,2.0,1.0,1.65),
 'english':island('english',-.8,-2.2,.35,1.65),
 'social':island('social',6.2,-.3,.6,1.45),
 'logic':island('logic',3.6,-3.5,.1,1.35)}
# Observatory with individual mullions, glazed dome panels, stone drum, telescope.
x,y,z=isles['mathematics'];s='mathematics'
cylinder(s+'_terrace',(x,y,z+.15),1.15,.16,stone);cylinder(s+'_drum',(x,y,z+.39),.90,.34,stone)
for i in range(12):
 a=i*math.tau/12;rod(s+'_window_mullion',(x+.9*math.cos(a),y+.9*math.sin(a),z+.55),(x+.9*math.cos(a),y+.9*math.sin(a),z+1.1),.025,gold)
 # Dome longitude curves are segmented rods following a true hemisphere.
 for j in range(8):
  t=j*math.pi/16;t2=(j+1)*math.pi/16
  a1=(x+.9*math.cos(t)*math.cos(a),y+.9*math.cos(t)*math.sin(a),z+1.1+.9*math.sin(t))
  b1=(x+.9*math.cos(t2)*math.cos(a),y+.9*math.cos(t2)*math.sin(a),z+1.1+.9*math.sin(t2));rod(s+'_dome_rib',a1,b1,.016,gold,8)
for j in range(5):
 t=j*math.pi/10;ring(s+'_dome_band',(x,y,z+1.1+.9*math.sin(t)),.9*math.cos(t),gold)
for i in range(12):
 for j in range(4):
  a=i*math.tau/12;b=(i+1)*math.tau/12;t=j*math.pi/8;u=(j+1)*math.pi/8
  vs=[(x+.89*math.cos(v)*math.cos(w),y+.89*math.cos(v)*math.sin(w),z+1.1+.89*math.sin(v)) for v,w in [(t,a),(t,b),(u,b),(u,a)]]
  mesh(s+'_dome_glazing',vs,[(0,1,2,3)],glass)
ring(s+'_drum_band',(x,y,z+.58),.92,gold)
rod(s+'_telescope',(x-.5,y-.1,z+1.1),(x+.45,y-.1,z+1.5),.095,gold,24)
for dx,dy in [(-.25,-.2),(.25,-.2),(0,.3)]:rod(s+'_tripod',(x+dx,y+dy,z+.58),(x,y,z+1.25),.022,wood)
# Greenhouse: roof, panes, narrow frames and real plants inside.
x,y,z=isles['science'];s='science'
cube(s+'_greenhouse_floor',(x,y,z+.15),(1.9,1.35,.16),stone,.03)
for xx in [-.9,-.45,0,.45,.9]:
 for yy in [-.6,.6]:
  rod(s+'_frame',(x+xx,y+yy,z+.23),(x+xx,y+yy,z+1.1),.022,gold)
  rod(s+'_roof_rib',(x+xx,y+yy,z+1.1),(x+xx,y,z+1.55),.022,gold)
for yy in [-.6,0,.6]:rod(s+'_roof_beam',(x-.9,y+yy,z+(1.55 if yy==0 else 1.1)),(x+.9,y+yy,z+(1.55 if yy==0 else 1.1)),.024,gold)
for yy in [-.6,.6]:
 for j in range(4):
  xx=-.9+j*.45;mesh(s+'_wall_glass',[(x+xx,y+yy,z+.25),(x+xx+.45,y+yy,z+.25),(x+xx+.45,y+yy,z+1.08),(x+xx,y+yy,z+1.08)],[(0,1,2,3)],glass)
  mesh(s+'_roof_glass',[(x+xx,y+yy,z+1.1),(x+xx+.45,y+yy,z+1.1),(x+xx+.45,y,z+1.54),(x+xx,y,z+1.54)],[(0,1,2,3)],glass)
for xx in [-.6,0,.6]:
 for yy in [-.33,.33]:
  cylinder(s+'_planter',(x+xx,y+yy,z+.32),.14,.22,wood);tree(s,x+xx,y+yy,z+.45,.48)
# Story garden: stacked books, an open book with curved page meshes.
x,y,z=isles['english'];s='english';cylinder(s+'_reading_dais',(x,y,z+.13),1.05,.16,stone)
for k,m in enumerate([wood,leaf[2],purple]):
 for dz in [0,.22]:cube(s+'_book_cover',(x-.28,y+.1,z+.25+k*.26+dz),(1.1,.72,.035),m,.015)
 cube(s+'_book_pages',(x-.28,y+.1,z+.36+k*.26),(1.03,.66,.17),ivory,.01)
 for j in range(5):cube(s+'_page_rule',(x-.28,y-.235,z+.30+k*.26+j*.03),(1.00,.003,.003),stone)
for side in [-1,1]:
 for page in range(5):
  verts=[]
  for j in range(9):
   u=j/8;xx=x+.2+side*u*.62;zz=z+.99+math.sin(u*math.pi)*.14+page*.006
   verts.extend([(xx,y-.4,zz),(xx,y+.43,zz)])
  mesh(s+'_open_book_pages',verts,[(j*2,j*2+1,j*2+3,j*2+2) for j in range(8)],ivory)
# Latitude globe: accurate schematic with equator and north-south axis.
x,y,z=isles['social'];s='social';cylinder(s+'_globe_base',(x,y,z+.2),.75,.22,stone)
rod(s+'_globe_stand',(x,y,z+.28),(x,y,z+.65),.08,gold)
sphere(s+'_globe_ocean',(x,y,z+1.05),(.62,.62,.62),blue,40,24)
for lat in [-60,-30,0,30,60]:
 a=math.radians(lat);ring(s+'_latitude_'+str(lat),(x,y,z+1.05+.625*math.sin(a)),.625*math.cos(a),gold,thick=.009)
for a in [0,math.pi/3,math.pi*2/3]:ring(s+'_longitude',(x,y,z+1.05),.625,gold,(math.pi/2,0,a),.009)
ring(s+'_meridian_frame',(x,y,z+1.05),.73,gold,(math.pi/2,0,0),.022)
rod(s+'_polar_axis',(x,y,z+.31),(x,y,z+1.79),.018,gold)
# Amethyst reasoning portal, crystal faces and concentric engraved platform.
x,y,z=isles['logic'];s='logic';cylinder(s+'_crystal_dais',(x,y,z+.17),.85,.18,stone)
for rr in [.6,.77]:ring(s+'_brass_inlay',(x,y,z+.27),rr,gold,thick=.012)
vs=[(x+.58*math.cos(i*math.tau/6),y+.58*math.sin(i*math.tau/6),z+.35) for i in range(6)]+[(x,y,z+1.8),(x,y,z+.22)]
faces=[(i,(i+1)%6,6) for i in range(6)]+[(i,7,(i+1)%6) for i in range(6)]
o=mesh(s+'_amethyst_crystal',vs,faces,purple)
for i in range(6):rod(s+'_crystal_edge',vs[i],vs[6],.009,gold,6)
# Curving bridges with individual planks and continuous handrails.
def bridge(a,b):
 A=Vector(isles[a]);B=Vector(isles[b]);D=B-A;D.z=0;D.normalize();A+=D*1.30;B-=D*1.22;perp=Vector((-D.y,D.x,0));pts=[]
 for i in range(23):
  t=i/22;p=A.lerp(B,t)+perp*math.sin(t*math.pi)*.20;p.z+=.18+math.sin(math.pi*t)*.30;pts.append(p)
 for i,p in enumerate(pts):
  o=cube(a+'_bridge_plank',p,(.16,.65,.07),wood,.012);o.rotation_euler.z=math.atan2(D.y,D.x)
  if i%3==0:
   for side in [-1,1]:rod(a+'_bridge_post',p+perp*.29*side,p+perp*.29*side+Vector((0,0,.48)),.018,gold,6)
 for p,q in zip(pts,pts[1:]):
  for side in [-1,1]:rod(a+'_bridge_rail',p+perp*.29*side+Vector((0,0,.48)),q+perp*.29*side+Vector((0,0,.48)),.014,gold,6)
for a,b in [('mathematics','science'),('mathematics','english'),('english','logic'),('science','social'),('social','logic')]:bridge(a,b)
# Export before render-only lights/camera so the website controls its own lighting.
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'world.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'world.glb'),export_format='GLB',export_cameras=False,export_lights=False)
coords=[o.matrix_world@Vector(v) for o in bpy.context.scene.objects if o.type=='MESH' for v in o.bound_box]
bounds={'min':[min(v[i] for v in coords) for i in range(3)],'max':[max(v[i] for v in coords) for i in range(3)],'objects':len(bpy.context.scene.objects)}
open(os.path.join(OUT,'world-metadata.json'),'w').write(json.dumps(bounds,indent=2));print('WORLD BOUNDS',bounds)
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=32;sc.render.resolution_x=1400;sc.render.resolution_y=900;sc.render.resolution_percentage=100
sc.render.film_transparent=True;sc.world.color=(.6,.65,.58)
bpy.ops.object.camera_add(location=(14,-23,15));cam=bpy.context.object;target=Vector((.8,-.6,.15));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=20.5;sc.camera=cam
for loc,power,size,col in [((-5,-8,14),2300,10,(1,.85,.65)),((10,5,12),3000,8,(1,.95,.8)),((-9,2,5),1800,8,(.65,.77,1))]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=col;o.rotation_euler=(target-o.location).to_track_quat('-Z','Y').to_euler()
sc.render.filepath=os.path.join(PRE,'world.png');bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'world.blend'))
print('QUEST GROVE WORLD EXPORTED')
