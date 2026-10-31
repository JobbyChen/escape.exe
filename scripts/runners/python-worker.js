// Real Python (CPython via Pyodide) in a disposable browser worker.
importScripts("../../vendor/python/pyodide.js");
let engine;
const harness = String.raw`
import ast, json, builtins, sys
sys.setrecursionlimit(180)
_payload = json.loads(_payload_json)
_source = _payload['source']
_tree = ast.parse(_source)
for _node in ast.walk(_tree):
    if isinstance(_node, (ast.Import, ast.ImportFrom, ast.With, ast.AsyncFunctionDef, ast.ClassDef, ast.Global, ast.Nonlocal, ast.LShift, ast.RShift)):
        raise ValueError('Unsupported in this beginner sandbox: imports, classes, async, global/nonlocal, and file access. Use functions and built-in collections.')
    if isinstance(_node, ast.Name) and _node.id.startswith('_') and _node.id != '_':
        raise ValueError('Private/internal names are not available in this sandbox.')
    if isinstance(_node, ast.Attribute) and _node.attr.startswith('_'):
        raise ValueError('Private/internal attributes are not available in this sandbox.')
    if isinstance(_node, ast.Constant) and isinstance(_node.value, (str, bytes)) and len(_node.value) > 16000:
        raise ValueError('Literal size limit exceeded.')
    if isinstance(_node, ast.Pow):
        raise ValueError('Exponentiation is outside this bounded beginner runner.')
_steps = 0
def _tick():
    global _steps
    _steps += 1
    if _steps > 20000:
        raise RuntimeError('Execution limit: more than 20,000 loop iterations or function calls.')
    return True
def _multiply(a, b):
    if isinstance(a, (list, tuple, str, bytes)) and isinstance(b, int) and len(a) * max(0,b) > 20000:
        raise ValueError('Collection/string memory limit exceeded.')
    if isinstance(b, (list, tuple, str, bytes)) and isinstance(a, int) and len(b) * max(0,a) > 20000:
        raise ValueError('Collection/string memory limit exceeded.')
    if isinstance(a,int) and isinstance(b,int) and (a.bit_length()+b.bit_length()>4096):
        raise ValueError('Integer size limit exceeded.')
    return _bounded(a*b)
def _range(*args):
    r = range(*args)
    if len(r)>20000: raise ValueError('range length limit exceeded.')
    return r
_allocated = 0
def _bounded(value):
    global _allocated
    if isinstance(value,(list,tuple,dict,set,str,bytes)):
        if len(value)>20000: raise ValueError('Collection size limit exceeded.')
        _allocated+=len(value)
        if _allocated>100000: raise ValueError('Cumulative allocation limit exceeded.')
    return value
def _add(a,b):
    if isinstance(a,(list,tuple,str)) and isinstance(b,type(a)) and len(a)+len(b)>20000:
        raise ValueError('Collection/string size limit exceeded.')
    return _bounded(a+b)
def _method(obj,name,*args,**kwargs):
    global _allocated
    if name not in ['append','extend','insert','pop','remove','reverse','sort','copy','count','index','lower','upper','strip','split','join','replace','startswith','endswith','get','keys','values','items','add','discard','update']:
        raise ValueError('Unsupported method in this bounded sandbox: '+name)
    if name=='join' and sum(len(str(v)) for v in args[0])>16000: raise ValueError('String limit exceeded.')
    if name in ['append','add','insert']: _allocated+=1
    if name in ['extend','update']: _allocated+=len(args[0])
    if name=='copy': _allocated+=len(obj)
    if _allocated>100000: raise ValueError('Cumulative allocation limit exceeded.')
    result=getattr(obj,name)(*args,**kwargs)
    if len(obj)>20000: raise ValueError('Collection size limit exceeded.')
    return _bounded(result)
def _mod(a,b):
    if isinstance(a,(str,bytes)): raise ValueError('String formatting is outside this bounded beginner runner.')
    return a%b
def _fstring(parts):
    if sum(map(len,parts))>16000: raise ValueError('Formatted string limit exceeded.')
    return _bounded(''.join(parts))
class _Guard(ast.NodeTransformer):
    def visit_JoinedStr(self,n):
        parts=[]
        for value in n.values:
            if isinstance(value,ast.Constant): parts.append(value)
            elif isinstance(value,ast.FormattedValue):
                if value.format_spec is not None or value.conversion not in [-1,115]:
                    raise ValueError('Unsupported advanced f-string formatting in this bounded runner.')
                parts.append(ast.Call(ast.Name('str',ast.Load()),[self.visit(value.value)],[]))
        return ast.copy_location(ast.Call(ast.Name('_fstring',ast.Load()),[ast.List(parts,ast.Load())],[]),n)

    def visit_List(self,n):
        self.generic_visit(n)
        if isinstance(n.ctx,ast.Load): return ast.copy_location(ast.Call(ast.Name('_bounded',ast.Load()),[n],[]),n)
        return n
    def visit_Tuple(self,n):
        self.generic_visit(n)
        if isinstance(n.ctx,ast.Load): return ast.copy_location(ast.Call(ast.Name('_bounded',ast.Load()),[n],[]),n)
        return n
    def visit_Dict(self,n):
        self.generic_visit(n); return ast.copy_location(ast.Call(ast.Name('_bounded',ast.Load()),[n],[]),n)
    def visit_Set(self,n):
        self.generic_visit(n); return ast.copy_location(ast.Call(ast.Name('_bounded',ast.Load()),[n],[]),n)

    def visit_AugAssign(self,n):
        if not isinstance(n.target,ast.Name): raise ValueError('Use explicit assignment for compound collection updates.')
        expanded=ast.Assign([n.target],ast.BinOp(ast.Name(n.target.id,ast.Load()),n.op,n.value))
        return ast.copy_location(self.visit(expanded),n)
    def visit_Subscript(self,n):
        self.generic_visit(n)
        if isinstance(n.slice,ast.Slice) and isinstance(n.ctx,ast.Load): return ast.copy_location(ast.Call(ast.Name('_bounded',ast.Load()),[n],[]),n)
        return n

    def visit_comprehension(self,n):
        self.generic_visit(n); n.ifs.insert(0,ast.Call(ast.Name('_tick',ast.Load()),[],[])); return n
    def visit_Call(self,n):
        self.generic_visit(n)
        if isinstance(n.func,ast.Attribute):
            return ast.copy_location(ast.Call(ast.Name('_method',ast.Load()),[n.func.value,ast.Constant(n.func.attr),*n.args],n.keywords),n)
        return n

    def visit_For(self,n):
        self.generic_visit(n); n.body.insert(0,ast.Expr(ast.Call(ast.Name('_tick',ast.Load()),[],[]))); return n
    def visit_While(self,n):
        self.generic_visit(n); n.body.insert(0,ast.Expr(ast.Call(ast.Name('_tick',ast.Load()),[],[]))); return n
    def visit_FunctionDef(self,n):
        self.generic_visit(n); n.body.insert(0,ast.Expr(ast.Call(ast.Name('_tick',ast.Load()),[],[]))); return n
    def visit_BinOp(self,n):
        self.generic_visit(n)
        if isinstance(n.op,ast.Mod): return ast.copy_location(ast.Call(ast.Name('_mod',ast.Load()),[n.left,n.right],[]),n)
        if isinstance(n.op,ast.Add): return ast.copy_location(ast.Call(ast.Name('_add',ast.Load()),[n.left,n.right],[]),n)
        if isinstance(n.op,ast.Mult): return ast.copy_location(ast.Call(ast.Name('_multiply',ast.Load()),[n.left,n.right],[]),n)
        return n
_tree=ast.fix_missing_locations(_Guard().visit(_tree))
_lines=[]
def _print(*args, sep=' ', end='\n'):
    text=sep.join(str(value) for value in args)+end
    if sum(map(len,_lines))+len(text)>12000: raise ValueError('Output limit exceeded.')
    _lines.append(text)
_safe={name:getattr(builtins,name) for name in ['abs','all','any','bool','dict','enumerate','float','int','len','list','max','min','reversed','round','set','sorted','str','sum','tuple','zip']}
def _factory(name):
    def make(*args,**kwargs): return _bounded(getattr(builtins,name)(*args,**kwargs))
    return make
for _name in ['list','dict','set','tuple','sorted','str']:
    _safe[_name]=_factory(_name)
_safe.update({'print':_print,'range':_range})
_ns={'__builtins__':_safe,'_tick':_tick,'_multiply':_multiply,'_add':_add,'_method':_method,'_bounded':_bounded,'_mod':_mod,'_fstring':_fstring}
_ns.update(_payload.get('context',{}))
exec(compile(_tree,'<player>','exec'),_ns)
_result=None
if _payload.get('entry'):
    fn=_ns.get(_payload['entry'])
    if not callable(fn): raise ValueError('Define the requested function '+_payload['entry'])
    _result=fn(*_payload.get('args',[]))
_result_json=json.dumps({'value':_result,'output':''.join(_lines).rstrip('\n'),'steps':_steps})
`;
onmessage = async ({ data }) => {
  try {
    if (!engine) {
      engine = await loadPyodide({
        indexURL: new URL("../../vendor/python/", location.href).href,
      });
      postMessage({ ready: true });
    }
    engine.globals.set("_payload_json", JSON.stringify(data));
    const result = await engine.runPythonAsync(harness + "\n_result_json");
    postMessage({ result: JSON.parse(result) });
  } catch (error) {
    postMessage({ error: String(error.message || error) });
  }
};
