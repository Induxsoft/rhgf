document.addEventListener("DOMContentLoaded",()=>
{
    nomina.init();
    variable.init();
    tipocontrato.init();
    cnomina.init();
    tablas.init();
    gconceptos.init();
    tnomina.init();
    tipopermiso.init();
})

var tools=
{
    $__enableFields:function(fields,enabled=false,enabledhidden=true)
	{
		if(fields==null)return;
		
		for(var i=0;i<fields.length;i++)
		{
			var inp=fields[i];
			this.$_enableField(inp,enabled,enabledhidden);
		}
	},
	$_enableField(inp,enabled=false,enabledhidden=true)
	{
		if(inp)
		{
			if(enabled)inp.removeAttribute("disabled");
			else inp.setAttribute("disabled",true);

			if(inp.type=="hidden" && enabledhidden)inp.removeAttribute("disabled");
		}
	},
    messageEvent(element,message="")
    {
        if(element)
        {
            if(message.trim()!="")
            {			
                element.setCustomValidity(message);	
                // element.oninvalid =(event)=>
                // {
                // 	event.target.setCustomValidity(message);
                // }
            }
            element.reportValidity();
        }
    },
    trigger:function(element,event)
    {
        var e=new Event(event);
        if(element)element.dispatchEvent(e);
    },
    alerText:function(idelem,text="",css="",time=4000)
	{
		if(idelem.trim()=="")return;
		var elm=document.querySelector(idelem);
		if(!elm)return;

		var _before_css=elm.style.cssText;

		elm.innerHTML=text;
		if(css!="")elm.style.cssText=css;

		setTimeout(function()
		{
			elm.innerHTML="";
			elm.style.cssText=_before_css;
		}, time);
	},
    fields:function(element,act="get",idlblart="",filter="",validatefrm=false)
	{
		if(filter=="")filter="input,select,textarea,input-key";

		if(!element)return null;

		var fields=element.querySelectorAll(filter);

		var data={};
		for (var i =0; i<fields.length; i++) 
		{
			var elm=fields[i];
			if(!elm)continue;
			var name=elm.getAttribute("name")??"";
			var isrequerido=elm.hasAttribute("required")?(/true/).test(elm.getAttribute("required")):false;
			var text=elm.getAttribute("text")??"";

			if(name.trim()!="")data[name]=elm.value;

			switch(act)
			{
				case "validate":
					if(isrequerido)
					{
						if(elm.getAttribute("type")=="input-key")
						{
							if(elm.getValue()==null)
							{
								tools.alerText(idlblart,"Aviso: "+text);
								elm.focus();
								return false;
							}
						}
						else if(elm.value.trim()=="" && !validatefrm)
						{
							tools.alerText(idlblart,"Aviso: "+text);
							elm.focus();
							return false;
						}
						if(elm.hasAttribute("ntype") && elm.getAttribute("ntype").toLowerCase()=="number")
						{
							if(Number(elm.value)<Number(elm.getAttribute("nmin")??0))
							{
								tools.alerText(idlblart,"Aviso: "+(elm.getAttribute("tmin")??""));
								elm.focus();
								return false;
							}
							if(Number(elm.value)>(tools.existencia??0) && !elm.hasAttribute("not_existencia"))
							{
								tools.alerText(idlblart,"Aviso: La cantidad no debe ser mayor a la existencia");
								elm.focus();
								return false;
							}
						}
						if(validatefrm && elm.value.trim()=="")
						{
							tools.messageEvent(elm);
							return false;
						}
					}
				break;
				case "clean":
					elm.value="";
					if(elm.getAttribute("type")=="input-key")
					{
						elm.setValue(null);
					}
				break;
				case "set":
						if(itm_add!=null)
						{
							if(name.trim()!="" && elm.getAttribute("type")!="input-key")elm.value=itm_add[name]??"";
						}
					break;

			}
		}

		if(act="get")return data;
	},
    filterFloat:function(evt,input,dec=4)
    {
        // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
        var key = window.Event ? evt.which : evt.keyCode;    
        var chark = String.fromCharCode(key);
        var tempValue = input.value+chark;
        if(key >= 48 && key <= 57){
            if(tools.filter(tempValue,dec)=== false){
                return false;
            }else{       
                return true;
            }
        }else{
              if(key == 8 || key == 13 || key == 0) {     
                  return true;              
              }else if(key == 46){
                    if(tools.filter(tempValue,dec)=== false){
                        return false;
                    }else{       
                        return true;
                    }
              }else{
                  return false;
              }
        }
    },
    filter:function(__val__,dec=4)
    {
    	
    	var regex = "^\([0-9]+\.?[0-9]{0,"+dec+"})$"; 
    	var preg=new RegExp(regex);
        // var preg = /^([0-9]+\.?[0-9]{0,4})$/;  //asi estaba antes ,se corrgio por la var dec
        if(preg.test(__val__) === true){
            return true;
        }else{
           return false;
        }
        
    },
    filterInt:function(evt,input)
    {
        // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
        var key = window.Event ? evt.which : evt.keyCode;    
        var chark = String.fromCharCode(key);
        var tempValue = input.value+chark;
        if(key >= 48 && key <= 57){
            if(tools.filterI(tempValue)=== false){
                return false;
            }else{       
                return true;
            }
        }else{
              if(key == 8 || key == 13 || key == 0) {     
                  return true;              
              }else if(key == 46){
                    if(tools.filterI(tempValue)=== false){
                        return false;
                    }else{       
                        return true;
                    }
              }else{
                  return false;
              }
        }
    },
    filterI:function(__val__)
    {
        var preg = /^([0-9]+?[0-9]{0,6})$/; 
        if(preg.test(__val__) === true){
            return true;
        }else{
           return false;
        }
        
    },
    format:function(number, decPlaces, decSep, thouSep)
    {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSep = typeof decSep === "undefined" ? "." : decSep;
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
      var j = (j = i.length) > 3 ? j % 3 : 0;

      return sign +
          (j ? i.substr(0, j) + thouSep : "") +
          i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
          (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    },
    round(num, decimales = 2) 
    {
	    var signo = (num >= 0 ? 1 : -1);
	    num = num * signo;
	    if (decimales === 0) 
	        return signo * Math.round(num);
	    num = num.toString().split('e');
	    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
	    num = num.toString().split('e');
	    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
	}
}
var itm_add=null;
var nomina=
{
    init()
    {
        nomina.table_nomina=document.getElementById("lst_nominas");
        nomina.table_recibo=document.getElementById("lst_recibos");
        nomina.table_recibo_conceptos=document.getElementById("lst_recibos_conceptos");

        nomina.concepto=document.getElementById("concepto");
        nomina.importe=document.getElementById("importe");
        nomina.leyenda=document.getElementById("leyenda");

        nomina.btn_save_recibo_concepto=document.getElementById("btn_save_recibo_concepto");
        nomina.input_key_add_recibo=document.getElementById("add_recibo");
        if(nomina.input_key_add_recibo)nomina.input_key_add_recibo.addEventListener("change",()=>
        {
            var data=nomina.input_key_add_recibo.getValue();
            if(!data)return;
            nomina.CreateRecibo();
        });
    },
    Editar()
    {
        if(!nomina.table_nomina)return;

        var data_seleted=nomina.table_nomina.DataArray[nomina.table_nomina.CurrentRowIndex()];
        if(Number(data_seleted?.sys_pk??0)<1)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return
        }
        var url=nomina.url_nomina+data_seleted.sys_pk+"/";
       
        window.location.href=url;
    },
    Editar_Recibo()
    {
        var data_seleted=nomina.table_recibo.DataArray[nomina.table_recibo.CurrentRowIndex()];
        if(Number(data_seleted?.sys_pk??0)<1)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return
        }
        var url=nomina.url_recibo+data_seleted.sys_pk+"/";
        
        window.location.href=url;
    },
    AddRecibo()
    {
        if(!nomina.input_key_add_recibo)
        {
            alert("Elemento no definido");
            return;
        }
        nomina.input_key_add_recibo.searchText("",false);
    },
    CreateRecibo()
    {
        var data=nomina.input_key_add_recibo.getValue();
        if(!data)
        {
            alert("Debe seleccionar un elemento");
            return;
        }
        var data=
        {
            ref_contrato:data.sys_pk
        }
        
        InduxsoftCrudlModel.InvokeService(nomina.url_recibo_nomina,data,
        function(data)
        {
            window.location.reload();
        },
        function(error)
        {
            alert(error.message ?? error);
        },"POST",false);
    },
    add:false,url_recibo_concepto:"",
    Add(idrecibo=0)
    {
        if(nomina.concepto)nomina.concepto.setValue(null);
        if(nomina.importe)nomina.importe.value=0;
        if(nomina.leyenda)nomina.leyenda.value="";
        nomina.add=true;
        nomina.openModal("modal_concepto");
        if(nomina.btn_save_recibo_concepto)nomina.btn_save_recibo_concepto.setAttribute("onclick","nomina.ConceptoSave('"+nomina.url_add_concepto_recibo.replace("@recibo",idrecibo)+"')");
    },
    Editar_concepto()
    {
        if(!nomina.table_recibo_conceptos)
        {
            alert("Table indifinido");
            return;
        }
        if(nomina.table_recibo_conceptos.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_recibo_conceptos.DataArray[nomina.table_recibo_conceptos.CurrentRowIndex()];
        data["descripcion"]=data.descripcion_concepto??"";
        data["codigo"]=data.codigo_concepto??"";
        
        console.log(data);
        nomina.concepto.setValue(data);

        var importe=data.importe??0;
        if(nomina.importe)nomina.importe.value=importe??0;
        if(nomina.leyenda)nomina.leyenda.value=data.leyenda??"";
        // if(data.percepcion>0)importe=data.percepcion;
        // else if(data.deduccion>0)importe=data.deduccion;
        // else if(data.obligacion>0)importe=data.obligacion;

        nomina.add=false;
        nomina.openModal("modal_concepto");
        if(nomina.btn_save_recibo_concepto)nomina.btn_save_recibo_concepto.setAttribute("onclick","nomina.ConceptoSave('"+nomina.url_concepto_recibo+data.sys_pk+"/"+"')");
        
    },
    ConceptoSave(url)
    {
        var concepto=nomina.concepto.getValue();
        if(!concepto)
        {
            alert("Debe seleccionar un concepto");
            return;
        }
        var data=
        {
            ref_concepto:concepto.ref_concepto??concepto.sys_pk,
            importe:Number(nomina.importe.value??0),
            leyenda:nomina.leyenda.value??""
        }
        
        InduxsoftCrudlModel.InvokeService(url,data,
        function(data)
        {
            window.location.reload();
        },
        function(error)
        {
            alert(error.message ?? error);
        },"POST",false);

    },
    DeleteReciboConcepto()
    {
        if(nomina.table_recibo_conceptos.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_recibo_conceptos.DataArray[nomina.table_recibo_conceptos.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,nomina.url_concepto_recibo);
    },
    DeleteNomina()
    {
        if(nomina.table_nomina.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=nomina.table_nomina.DataArray[nomina.table_nomina.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,nomina.url_nomina);
    },
    DeleteRecibo()
    {
        if(nomina.table_recibo.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data_seleted=nomina.table_recibo.DataArray[nomina.table_recibo.CurrentRowIndex()];
        if(Number(data_seleted?.sys_pk??0)<1)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        nomina.DeleteEntity(data_seleted.sys_pk,nomina.url_recibo);
    },
    DeleteEntity(pk,url="./")
    {
        var res = confirm("¿Desea eliminar el elemento seleccionado?");
		if (!res) return;

		InduxsoftCrudlModel.InvokeService(url + pk + "/", null,
			function (data) 
            {
				window.location.reload();
			},
			function (error) {
				alert(error.message ?? error);
			}, "DELETE", false
		);
    },
    openModal(modalId='')
    {
        this.getBSModal(modalId).show();
    },
    closeModal(modalId='')
    {
        this.getBSModal(modalId).hide();
    },
    getBSModal(modalId='')
    {
        const modalElement = document.getElementById(modalId);

        if(!modalElement)
        {
            console.log("Elemento no definido");
            return;
        }
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (!bsModal) return new bootstrap.Modal(modalElement);

        return bsModal;
    }
    
}
var crud=
{
    services(url,data=null,method="POST")
    {
        InduxsoftCrudlModel.InvokeService(url,data,
        function(data)
        {
            window.location.reload();
        },
        function(error)
        {
            alert(error.message ?? error);
        },method,false);
    },
    trigger(element,event)
    {
        var e=new Event(event);
       if(element)element.dispatchEvent(e);
    },
    Cancelar(url,sys_recver)
    {
        var data=
        {
            cancelado:1,
            sys_recver:sys_recver
        }
        crud.services(url,data,"PUT");
    }
}
var variable=
{
    init()
    {
        variable.modal_variables=document.getElementById("modal_frm_variables");
        variable.table_variables=document.getElementById("lst_variables");
        variable.btn_aceptar=document.getElementById("btn_save_variables");
    },
    addVariable(add=false,_entity_id="_new")
    {
        if(!add)
        {
            tools.fields(variable.modal_variables,"clean");
            nomina.openModal("modal_frm_variables");
            if(variable.btn_aceptar)variable.btn_aceptar.setAttribute("onclick","variable.addVariable(true)");
        }
        else
        {
            if(!tools.fields(variable.modal_variables,"validate","","",true))return;
            
            var datas=tools.fields(variable.modal_variables,"get");
            if(!datas)
            {
                alert("Debe rellenar los campos correspondientes");
                return;
            }
            crud.services(variable.url_variables+_entity_id+"/",datas,_entity_id!="_new"?"PUT":"POST");
        }
    },
    DeleteVariable()
    {
        if(!variable.table_variables)return;

        if(variable.table_variables.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=variable.table_variables.DataArray[variable.table_variables.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,variable.url_variables);
    },
    EditarVariable()
    {
        itm_add=null;
        if(!variable.table_variables)return;

        if(variable.table_variables.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=variable.table_variables.DataArray[variable.table_variables.CurrentRowIndex()];
        itm_add=data;
        tools.fields(variable.modal_variables,"set");
        nomina.openModal("modal_frm_variables");
        if(variable.btn_aceptar)variable.btn_aceptar.setAttribute("onclick","variable.addVariable(true,"+data.sys_pk+")");
    }
}

var tipocontrato=
{
    init()
    {
        tipocontrato.table=document.getElementById("lst_tipocontrato");
        tipocontrato.modal=document.getElementById("modal_frm_tipocontrato");
        tipocontrato.btn_aceptar=document.getElementById("btn_save_tipocontrato")
    },
    Delete()
    {
        if(!tipocontrato.table)return;

        if(tipocontrato.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=tipocontrato.table.DataArray[tipocontrato.table.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,tipocontrato.url);
    },
    Add(add=false,_entity_id="_new",method="POST")
    {
        if(!add)
        {
            tools.fields(tipocontrato.modal,"clean");
            nomina.openModal("modal_frm_tipocontrato");
            if(tipocontrato.btn_aceptar)tipocontrato.btn_aceptar.setAttribute("onclick","tipocontrato.Add(true)");
        }   
        else
        {
            if(!tools.fields(tipocontrato.modal,"validate","","",true))return;

            var data=tools.fields(tipocontrato.modal,"get");
            crud.services(tipocontrato.url+_entity_id+"/",data,method);
        }
    },
    Editar()
    {
        itm_add=null;
        if(tipocontrato.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=tipocontrato.table.DataArray[tipocontrato.table.CurrentRowIndex()];
        itm_add=data;

        tools.fields(tipocontrato.modal,"set");
        nomina.openModal("modal_frm_tipocontrato");
        if(tipocontrato.btn_aceptar)tipocontrato.btn_aceptar.setAttribute("onclick","tipocontrato.Add(true,"+data.sys_pk+",'PUT')");
    }
}

var cnomina=
{
    init()
    {
        cnomina.table=document.getElementById("lst_conceptos_nomina");
    },
    
    Editar()
    {
        if(!cnomina.table)return;

        if(cnomina.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=cnomina.table.DataArray[cnomina.table.CurrentRowIndex()];
        window.location.href=cnomina.url+ data.sys_pk+"/";
    },
    Delete()
    {
        if(!cnomina.table)return;

        if(cnomina.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=cnomina.table.DataArray[cnomina.table.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,cnomina.url);
    }
}
var tablas=
{
    init()
    {
        tablas.table=document.getElementById("lst_tablas");
    },
    Delete()
    {
        if(!tablas.table)return;

        if(tablas.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=tablas.table.DataArray[tablas.table.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,tablas.url);
    }
}

var gconceptos=
{
    init()
    {
        gconceptos.table=document.getElementById("lst_gconceptos");
        gconceptos.modal=document.getElementById("modal_frm_gconceptos");
        gconceptos.btn_save=document.getElementById("btn_save_gconcepto");
    },
    Add(add=false,_entity_id="_new",method="POST")
    {
        /* if(!add)
        {
            tools.fields(gconceptos.modal,"clean");
            nomina.openModal("modal_frm_gconceptos");
            if(gconceptos.btn_save)gconceptos.btn_save.setAttribute("onclick","gconceptos.Add(true)");
        }
        else
        {
            if(!tools.fields(gconceptos.modal,"validate","","",true))return;

            var data=tools.fields(gconceptos.modal,"get");
            crud.services(gconceptos.url+_entity_id+"/",data,method);
        } */
        
        window.location.href = gconceptos.url + _entity_id;
    },
    Editar()
    {
        itm_add=null;
        if(!gconceptos.table)return;

        if(gconceptos.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }

        var data=gconceptos.table.DataArray[gconceptos.table.CurrentRowIndex()];
        /* itm_add=data;
        tools.fields(gconceptos.modal,"set");
        nomina.openModal("modal_frm_gconceptos");
        if(gconceptos.btn_save)gconceptos.btn_save.setAttribute("onclick","gconceptos.Add(true,"+data.sys_pk+",'PUT')"); */

        window.location.href = gconceptos.url + data.sys_pk;
    },
    Delete()
    {
        if(!gconceptos.table)return;

        if(gconceptos.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=gconceptos.table.DataArray[gconceptos.table.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,gconceptos.url);
    }

}

var tnomina=
{
    init()
    {
        tnomina.table=document.getElementById("lst_tnominas");
    },
    Editar()
    {
        if(!tnomina.table)return;

        if(tnomina.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=tnomina.table.DataArray[tnomina.table.CurrentRowIndex()];
        window.location.href=tnomina.url+data.sys_pk+"/";
    },
    Delete()
    {
        if(!tnomina.table)return;

        if(tnomina.table.CurrentRowIndex()<0)
        {
            alert("Debe seleccionar un elemento de la tabla");
            return;
        }
        var data=tnomina.table.DataArray[tnomina.table.CurrentRowIndex()];
        nomina.DeleteEntity(data.sys_pk,tnomina.url);
    }
}

var tipopermiso=
{
    init()
    {
        tipopermiso.ent_tarde=document.getElementById("ent_tarde");
        tipopermiso.sal_temp=document.getElementById("sal_temp");
        tipopermiso.todo_dia=document.getElementById("todo_dia");
        tipopermiso.ref_motivo=document.getElementById("ref_motivo");
        if(tipopermiso.ref_motivo)tipopermiso.ref_motivo.addEventListener("change",()=>
        {
            var m=Number(tipopermiso.ref_motivo.value);
            if(m==0 || m==1)
            {
                if(tipopermiso.todo_dia)
                {
                    tipopermiso.todo_dia.checked=true;
                    crud.trigger(tipopermiso.todo_dia,"change");
                }
            }
            else
            {
                if(tipopermiso.todo_dia)
                {
                    tipopermiso.todo_dia.checked=false;
                    crud.trigger(tipopermiso.todo_dia,"change");
                }
            }
        });

        if(tipopermiso.todo_dia)tipopermiso.todo_dia.addEventListener("change",()=>
        {
            if(tipopermiso.ent_tarde)tipopermiso.ent_tarde.removeAttribute("disabled");
            if(tipopermiso.sal_temp)tipopermiso.sal_temp.removeAttribute("disabled");

            if(tipopermiso.todo_dia.checked)
            {
                if(tipopermiso.ent_tarde)
                {
                    tipopermiso.ent_tarde.checked=false;
                    tipopermiso.ent_tarde.setAttribute("disabled","true");
                }
                if(tipopermiso.sal_temp)
                {
                    tipopermiso.sal_temp.checked=false;
                    tipopermiso.sal_temp.setAttribute("disabled","true");
                }
            }
            else
            {
                if(tipopermiso.ref_motivo)tipopermiso.ref_motivo.value=2;
            }
        });
        crud.trigger(tipopermiso.ref_motivo,"change");
    },
    validate()
    {
        if(!tipopermiso.ent_tarde.checked && !tipopermiso.sal_temp.checked && !tipopermiso.todo_dia.checked)
        {
            alert("Debe seleccionar alguna de las opciones");
            return false;
        }
        return true;
    }
}