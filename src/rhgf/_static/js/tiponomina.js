
document.addEventListener("DOMContentLoaded",()=>
{
    tn.init();
});
var tn=
{
    init()
    {
        tn.ref_rh_frec_periodo=document.getElementById("ref_rh_frec_periodo");
        tn.final1=document.getElementById("final1");
        tn.final2=document.getElementById("final2");
        tn.final3=document.getElementById("final3");

        tn.lbl_final1=document.getElementById("lbl_final1");
        tn.lbl_final2=document.getElementById("lbl_final2");
        tn.lbl_final3=document.getElementById("lbl_final3");

        tn.div_1=document.getElementById("div_1");
        tn.div_2=document.getElementById("div_2");
        tn.div_3=document.getElementById("div_3");

        tn.inicio=document.getElementById("div_inicio");
        tn.dias_cierre=document.getElementById("div_dias_cierre");

        var htmlfinal1=tn.final1.innerHTML??"";
        if(tn.ref_rh_frec_periodo)tn.ref_rh_frec_periodo.addEventListener("change",()=>
        {
            var option=tn.ref_rh_frec_periodo.options[tn.ref_rh_frec_periodo.selectedIndex];
            if(!option)return;
            var data=JSON.parse(option.getAttribute("data"));
            
            if(tn.lbl_final1)tn.lbl_final1.innerHTML="Fin del primer periodo del mes:";
            if(tn.div_1) tools.toggle(tn.div_1);
            if(tn.div_2) tools.toggle(tn.div_2);
            if(tn.div_3) tools.toggle(tn.div_3);
            if(tn.inicio)tn.inicio.style.cssText="display:block";
            if(tn.dias_cierre)tn.dias_cierre.style.cssText="display:block";

            if(tn.final1)tn.final1.innerHTML=htmlfinal1;
            switch(data.dias??0)
            {
                case 7://semanal
                    if(tn.div_1) tools.toggle(tn.div_1,true);
                    if(tn.final1)tn.final1.innerHTML=tn.semanas;
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Finaliza el día:";
                    break; 
                case 10://decenal
                    if(tn.div_1) tools.toggle(tn.div_1,true);
                    if(tn.div_2) tools.toggle(tn.div_2,true);
                    if(tn.div_3) tools.toggle(tn.div_3,true);
                    break; 
                case 14://catorcenal
                    if(tn.div_1) tools.toggle(tn.div_1,true);
                    if(tn.final1)tn.final1.innerHTML=tn.semanas;
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Finaliza el día:";
                    break;
                case 15://quincenal
                    if(tn.div_1) tools.toggle(tn.div_1,true);
                    if(tn.div_2) tools.toggle(tn.div_2,true);
                    break;
                case 30://mensual
                case 60://bimestral
                    if(tn.div_1) tools.toggle(tn.div_1,true);
                    if(tn.lbl_final1)tn.lbl_final1.innerHTML="Día del mes:";
                    break;
                default:
                    if(tn.inicio)tn.inicio.style.cssText="display:none";
                    if(tn.dias_cierre)tn.dias_cierre.style.cssText="display:none";
                    break
                
            }
        });

        crud.trigger(tn.ref_rh_frec_periodo,"change");

        const table_var_nomina = document.getElementById("table_var_nomina");
        const table_var_empleado = document.getElementById("table_var_empleado");

        if (table_var_nomina && table_var_empleado)
        {
            [table_var_nomina, table_var_empleado].forEach(table=>{
                table.AutoAddRow = false;
                table.AutoDelRow = false;
                table.EverMove = false;
            });
        }

        ["btn_add_varnomina","btn_add_varempleado"].forEach(id=>{
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => { this.addVar(btn) });
        });
        ["btn_del_varnomina","btn_del_varempleado"].forEach(id=>{
            let btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => { this.deleteVar(btn) });
        });
        ["ipt_var_nomina","ipt_var_empleado"].forEach(id=>{
            const input = document.getElementById(id);
            if (input) input.addEventListener('keydown', e => {
                if (e.key==="Enter") {
                    e.preventDefault();
                    const btn = document.querySelector(`button[iptid=${id}]`);
                    if (btn) btn.click();
                    return;
                }
            });
        });
    },
    addVar(btn)
    {
        const input = document.getElementById(btn.getAttribute("iptid"));
        const table = document.getElementById(btn.getAttribute("table"));
        
        if (input && table)
        {
            const val =  input.value;
            if (!val) return;

            const reg = /^[a-zA-Z@_][a-zA-Z0-9@_]*$/;

            if (!reg.exec(val)) {
                alert("El identificador (nombre) para la variable no es válido. Debe iniciar con una letra [a-z], el guión bajo [_], o el caracter arroba [@], no debe contener espacios en blanco, signos, símbolos o caracteres especiales");
                input.select();
                return;
            }

            let obj = {};
            obj[tn.vars_field_name] = val;
            table.DataArray.push(obj);
            table._printRows();
            input.value="";
            this.setInputHidenValues(btn,table);
        }
    },
    deleteVar(btn)
    {
        const table = document.getElementById(btn.getAttribute("table"));
        if (table) { 
            table._dataArrayBackup=[]; 
            table.DeleteCurrentRow(); 
            this.setInputHidenValues(btn,table);
        }
    },
    setInputHidenValues(btn,table)
    {
        const inputHiden = document.querySelector(`input[name=${btn.getAttribute("inputhidden")??'_qwerty_'}]`);
        if (inputHiden) inputHiden.value = table.DataArray.map(obj=>{ return obj[tn.vars_field_name]}).toString();
    },
    validate()
    {
        const isHidde_1 = tn.div_1.classList.contains('d-none');
        const isHidde_2 = tn.div_2.classList.contains('d-none');
        const isHidde_3 = tn.div_3.classList.contains('d-none');

        if(Number(tn.final1.value)>Number(tn.final2.value) && !isHidde_2)
        {
            alert("El primer período no puede ser mayor al segundo");
            return false;
        }

        if(Number(tn.final2.value)>Number(tn.final3.value) && !isHidde_3)
        {
            alert("El segundo período no puede ser mayor al tercer período");
            return false;
        }

        const name = document.querySelector("input[name='nombre']");
        const dias = document.querySelector("input[name='dias']");
        
        if (name && name.value.trim()==""){
            alert("El campo Nombre es requerido");
            return false;
        }
        if (dias && dias.value.trim()==""){
            alert("El campo Días a pagar es requerido");
            return false;
        }
        return true;
    }
}