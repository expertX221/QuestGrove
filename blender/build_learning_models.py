"""Blender model sources for grade-specific interactive concept lessons.
Run: blender --background --python blender/build_learning_models.py
"""
import os
here=os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(here,'build_world.py'),encoding='utf-8').read().split('isles={')[0])
def clear():
 for o in list(bpy.data.objects):bpy.data.objects.remove(o,do_unlink=True)
def export(name):
 bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,name+'.blend'))
 bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,name+'.glb'),export_format='GLB',export_cameras=False,export_lights=False)
 sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=20;sc.render.resolution_x=500;sc.render.resolution_y=500;sc.render.resolution_percentage=100;sc.render.film_transparent=True;sc.world.color=(.65,.65,.6)
 bpy.ops.object.camera_add(location=(3.5,-5.5,3.5));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.8;sc.camera=cam
 for loc,power,size in [((2,-4,6),600,4),((-4,-1,3),450,3),((0,4,5),800,3)]:
  bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
 sc.render.filepath=os.path.join(PRE,name+'.png');bpy.ops.render.render(write_still=True)
 print('EXPORTED LEARNING MODEL',name,flush=True)
 clear()
def cone_mesh(n,p,rb,rt,h,m,N=40):
 vs=[(p[0]+r*math.cos(i*math.tau/N),p[1]+r*math.sin(i*math.tau/N),p[2]+zz) for r,zz in [(rb,0),(rt,h)] for i in range(N)]
 return mesh(n,vs,[(i,(i+1)%N,(i+1)%N+N,i+N) for i in range(N)],m)
# Fractions: eight equal sectors, half highlighted, true equal angular areas.
for k in range(8):
 a=k*math.tau/8+.015;b=(k+1)*math.tau/8-.015;N=10;vs=[]
 for z in [-.13,.13]:
  vs.append((0,0,z));vs.extend([(1.15*math.cos(a+(b-a)*j/N),1.15*math.sin(a+(b-a)*j/N),z) for j in range(N+1)])
 L=N+2;faces=[tuple(range(L-1,-1,-1)),tuple(range(L,L*2))]
 faces += [(j,j+1,j+1+L,j+L) for j in range(L-1)]+[(L-1,0,L,2*L-1)]
 mesh('fractions_equal_eighth_'+str(k+1),vs,faces,purple if k<4 else ivory)
export('fractions')
# Integers: symmetric number line with signed tick names and beads.
rod('numberline_axis',(-1.4,0,0),(1.4,0,0),.025,gold)
for i in range(-3,4):
 x=i*.4;rod('numberline_tick_'+str(i),(x,-.12,0),(x,.12,0),.018,stone)
 sphere('numberline_integer_'+str(i),(x,0,.12),(.075,.075,.075),purple if i<0 else leaf[2] if i>0 else gold)
for side in [-1,1]:
 cone_mesh('numberline_arrow',(-1.5 if side<0 else 1.5,0,0),.08,0,.16,gold)
export('numberline')
# Linear equations: the pans hold equal weights and a level beam.
cube('balance_base',(0,0,-.95),(1.3,.7,.15),stone,.03)
rod('balance_pillar',(0,0,-.88),(0,0,.75),.055,gold)
rod('balance_level_beam',(-1.1,0,.72),(1.1,0,.72),.035,gold)
for x in [-.85,.85]:
 for y in [-.23,.23]:rod('balance_suspension',(x,0,.72),(x,y,-.20),.013,gold)
 cylinder('balance_pan',(x,0,-.24),.34,.04,stone)
cube('balance_unknown_weight',(-.85,0,-.02),(.33,.33,.4),purple,.02)
for dx in [-.13,.13]:cube('balance_unit_weight',(.85+dx,0,-.08),(.19,.25,.28),gold,.015)
export('balance')
# Triangular prism whose face has a visible base and altitude.
vs=[(-1,-.12,-.6),(1,-.12,-.6),(0,-.12,1),(-1,.12,-.6),(1,.12,-.6),(0,.12,1)]
mesh('triangle_area_face',vs,[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)],purple)
rod('triangle_base',vs[0],vs[1],.025,gold)
rod('triangle_height',(0,-.15,-.6),(0,-.15,1),.018,ivory)
cube('triangle_right_angle',(0.08,-.16,-.52),(.16,.015,.015),ivory)
cube('triangle_right_angle_vertical',(.16,-.16,-.52),(.015,.015,.16),ivory)
export('triangle')
# Filtration: broad filter funnel draining into a transparent beaker.
cone_mesh('filtration_glass_beaker',(0,0,-1),.48,.48,.76,glass)
cylinder('filtration_water',(0,0,-.88),.44,.18,blue)
ring('filtration_beaker_rim',(0,0,-.24),.49,gold,thick=.015)
cone_mesh('filtration_funnel',(0,0,.15),.10,.66,.72,glass)
cone_mesh('filtration_filter_paper',(0,0,.22),.12,.60,.59,ivory)
rod('filtration_funnel_tube',(0,0,-.3),(0,0,.17),.07,glass,20)
for i in range(8):
 a=i*2.4;r=.2+random.random()*.22;ico('filtration_trapped_sand',(math.cos(a)*r,math.sin(a)*r,.68),(.05,.04,.03),rock[3],1)
export('filtration')
# Heat conduction: metal spoon, hot drink and ceramic mug.
cone_mesh('heat_ceramic_mug',(-.2,0,-.8),.49,.53,.88,ivory)
cylinder('heat_drink',(-.2,0,-.05),.48,.02,wood)
ring('heat_mug_rim',(-.2,0,.08),.53,ivory,thick=.035)
ring('heat_mug_handle',(.39,0,-.35),.3,ivory,(math.pi/2,0,0),.07)
rod('heat_metal_spoon_handle',(-.2,0,-.35),(.8,0,1.1),.04,gold)
sphere('heat_spoon_bowl',(-.25,0,-.4),(.18,.08,.25),gold)
for i in range(3):
 x=-.35+i*.16
 for j in range(5):rod('heat_rising_steam',(x+.04*math.sin(j),0,.2+j*.12),(x+.04*math.sin(j+1),0,.2+(j+1)*.12),.012,glass,6)
export('heat')
# Pressure: equal weights on different contact areas.
cube('pressure_surface',(0,0,-.8),(2.7,1.1,.16),stone,.03)
cube('pressure_wide_contact',(-.72,0,-.62),(.95,.75,.12),purple,.02)
cube('pressure_narrow_contact',(.72,0,-.62),(.28,.28,.12),purple,.02)
for x in [-.72,.72]:
 rod('pressure_support',(x,0,-.56),(x,0,-.17),.09,gold)
 cube('pressure_equal_weight',(x,0,.10),(.55,.55,.55),gold,.03)
export('pressure')
# A closed battery-wire-bulb circuit with a clearly modeled switch.
cube('circuit_board',(0,0,-.5),(2.7,1.8,.1),stone,.035)
cube('circuit_battery',(-.85,0,-.2),(.45,.75,.48),purple,.025)
for y in [-.21,.21]:cylinder('circuit_battery_terminal',(-.85,y,.075),.06,.08,gold)
cylinder('circuit_lamp_base',(.8,0,-.28),.25,.22,gold)
sphere('circuit_lamp_bulb',(.8,0,.15),(.30,.30,.42),ivory)
rod('circuit_filament',(.69,0,-.06),(.91,0,.24),.018,gold)
for y in [-.65,.65]:
 for a,b in [((-.85,y,-.39),(.8,y,-.39)),((-.85,0,-.39),(-.85,y,-.39)),((.8,y,-.39),(.8,0,-.39))]:rod('circuit_insulated_wire',a,b,.025,leaf[1],10)
cube('circuit_switch_base',(0,-.65,-.3),(.45,.3,.13),wood,.025)
rod('circuit_closed_switch',(-.16,-.65,-.20),(.16,-.65,-.20),.025,gold)
export('circuit')
print('EIGHT CURRICULUM MODELS EXPORTED',flush=True)
