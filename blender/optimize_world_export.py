"""Optimize web draw calls while retaining the fully editable world.blend source.
Run after build_world.py. Only the GLB is replaced; the .blend is never modified.
"""
import bpy,os,json,struct
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out=os.path.join(root,'public','models')
bpy.ops.wm.open_mainfile(filepath=os.path.join(out,'world.blend'))
groups={}
for o in list(bpy.context.scene.objects):
 if o.type!='MESH':continue
 subject=o.name.split('_')[0]
 key=(subject,tuple(m.name if m else '' for m in o.data.materials))
 groups.setdefault(key,[]).append(o)
for (subject,mats),objects in groups.items():
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]
 if len(objects)>1:bpy.ops.object.join()
 bpy.context.view_layer.objects.active.name=subject+'_'+(mats[0].replace(' ','_') if mats else 'surface')
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'world.glb'),export_format='GLB',export_cameras=False,export_lights=False)
p=os.path.join(out,'world-metadata.json')
data=json.load(open(p));data['web_meshes']=len([o for o in bpy.context.scene.objects if o.type=='MESH'])
blob=open(os.path.join(out,'world.glb'),'rb').read();length=struct.unpack_from('<I',blob,12)[0];gltf=json.loads(blob[20:20+length])
data['triangles']=sum(gltf['accessors'][primitive['indices']]['count']//3 for mesh in gltf['meshes'] for primitive in mesh['primitives'])
open(p,'w').write(json.dumps(data,indent=2))
print('WEB MESH GROUPS',data['web_meshes'])
