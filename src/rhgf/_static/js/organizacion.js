document.addEventListener("DOMContentLoaded", () => {
    org.inicialize();
});

var org =
{
    path:"", contratos_indeterminados:"",
    GET:{},
    tOrganigrama:null, itemSelected:null,

    inicialize()
    {
        org.ref_turno=document.getElementById("ref_turno");
        org.ik_puesto=document.getElementById("ik_puesto");
        this.sel_tipo_contrato=document.getElementById("sel_tipo_contrato");
        this.txt_fin_contrato=document.getElementById("txt_fin_contrato");

        if(org.ik_puesto)org.ik_puesto.addEventListener("change",
        ()=>
        {
            var data=org.ik_puesto.getValue();
            if(org.ref_turno)
            {
                var uri=org.url_turno_search;
                
                if(!data)
                {
                    org.ref_turno.setAttribute("disabled","true");
                    org.ref_turno.setAttribute("data-source","");
                }
                else
                {
                    uri=uri.replace("@unidad",(data.pkunidad??""));
                    org.ref_turno.removeAttribute("disabled");
                    org.ref_turno.setAttribute("data-source",uri);
                }
            }
           
        });

        if(this.sel_tipo_contrato)this.sel_tipo_contrato.addEventListener("change",
        ()=>
        {
            if(!org.contratos_indeterminados)return;
            if(org.txt_fin_contrato)
            {
                org.txt_fin_contrato.removeAttribute("disabled");
                org.txt_fin_contrato.setAttribute("required",true);
            }

            var option_selected=org.sel_tipo_contrato.options[org.sel_tipo_contrato.selectedIndex]??null;
            var strdata=option_selected?.getAttribute("tipo-contrato")??"";

            if(strdata.trim()!="")
            {
                if(org.contratos_indeterminados.includes(strdata))
                {
                    if(org.txt_fin_contrato)
                    {
                        org.txt_fin_contrato.value="",
                        org.txt_fin_contrato.setAttribute("disabled",true);
                        org.txt_fin_contrato.removeAttribute("required");
                    }
                }
            }
        });

        tools.trigger(this.sel_tipo_contrato,"change");
    },

    init()
    {
        this.tOrganigrama = document.getElementById("tbl_organigrama");

        this.setAjustPanelUnidadEvent();
        this.setEvents();
        this.setTableEvents();

        unidad.list.init();
        puesto.list.init();
        contrato.list.init();

        if ((this.GET?.s??'')) {
            let index = this.tOrganigrama.DataArray.findIndex(obj => obj.sys_guid === this.GET.s);
            let tr = this.tOrganigrama.GetTrByIndex(index);
            
            const tbody = this.tOrganigrama.GetTBody();
            const expandParent = (row) => {
                if (!row) return;
                let parent = tbody.querySelector(`tr[id="${row.getAttribute("parent")}"]`);
                if (parent) {
                    this.tOrganigrama.ExpandRow(parent);
                    expandParent(parent);
                }
            }
            
            this.tOrganigrama.NavTo(index,0);
            expandParent(tr);
        }
    },

    setEvents()
    {
        document.getElementById("btn_edt").addEventListener("click", () => {
            if (Object.keys(this.itemSelected??{}).length == 0) {
                alert("Debe seleccionar un elemento del organigrama.");
                return
            }

            this.edt(this.itemSelected.sys_pk, this.itemSelected.tipo);
        });

        document.getElementById("btn_del").addEventListener("click", () => {
            if (Object.keys(this.itemSelected??{}).length == 0) {
                alert("Debe seleccionar un elemento del organigrama.");
                return
            }

            this.del(this.itemSelected.sys_pk, this.itemSelected.tipo, () => {
                this.tOrganigrama.DeleteRow(this.tOrganigrama.CurrentRowIndex());
                // this.recursiveDeletion(this.tOrganigrama,this.itemSelected);
                this.itemSelected = null;
            });
        });
    },

    setTableEvents()
    {
        if (!this.tOrganigrama) return;

        const events = this.tOrganigrama.EdiTable.Const.Events;
        
        this.tOrganigrama.hiddeSelector = true;
        this.tOrganigrama.AutoAddRow = false;
        this.tOrganigrama.AutoDelRow = false;
        this.tOrganigrama.ShowAsTree = true;

        this.tOrganigrama.Events[events.EnterCell] = (e) => {
            this.itemSelected = this.tOrganigrama.DataArray[e.sender.CurrentRowIndex()];
            this.getContratos();
        }
    },

    toggleLeftPanel()
    {
        const tabUnidades = document.querySelector('#organigrama_container');
        if (tabUnidades) tabUnidades.classList.toggle('hidde-unidad');
    },
    setAjustPanelUnidadEvent()
    {
        const line = document.querySelector('#ajust_panel_unidad');
        if (line)
        {
            let pageX, unidadPanel, unidadPanelWidth;
            
            line.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
            }
            line.onmousedown = (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                unidadPanel = e.target.parentElement;
                unidadPanel.style.transition = 'none';
                unidadPanel.classList.remove('hidde-unidad');
                pageX = e.pageX;
                unidadPanelWidth = unidadPanel.offsetWidth;
            }
            document.onmousemove = (e) => {
                e.stopPropagation();
                if (unidadPanel) {
                    let diffX = (e.pageX - pageX);
                    unidadPanel.style.width = (unidadPanelWidth + diffX)+'px';
                }
            }
            document.onmouseup = (e) => {
                e.stopPropagation();
                if (unidadPanel) unidadPanel.style.transition = '.5s';
                unidadPanel = undefined;
                pageX = undefined;
                unidadPanelWidth = undefined;
            }
        }
    },

    add(_view="")
    {
        let url_redir = (this.path) ? this.path + "_new/" : "./_new/";
        if (_view.trim() != "") url_redir += _view + "/";
        url_redir += "?s="+this.itemSelected?.sys_guid;

        if (_view=="unidad" && Object.keys(this.itemSelected??{}).length > 0 && this.itemSelected.tipo=="unidad") url_redir += "&superior="+this.itemSelected.sys_pk;
        if (_view=="puesto" && Object.keys(this.itemSelected??{}).length > 0) url_redir += "&"+this.itemSelected.tipo+"="+this.itemSelected.sys_pk
        
        window.location.href = url_redir;
    },
    edt(id,_view="")
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }

        let url_redir = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        if (_view.trim() != "") url_redir += _view + "/";
        url_redir += "?s="+this.itemSelected?.sys_guid;

        window.location.href = url_redir;
    },
    del(id,_view="",callback=null)
    {
        if ((typeof id === "number" && id <= 0) || (typeof id === "string" && id.trim() == "")) {
            console.error("Debe indicar un identificador válido");
            return;
        }
        if (!confirm("¿Esta seguro que desea eliminar el registro seleccionado?")) return;
        
        let url = (this.path) ? this.path + id.toString() + "/" : "./" + id.toString() + "/";
        if (_view.trim() != "") url += _view + "/";

        InduxsoftCrudlModel.InvokeService(url,null,
            function(data){
                if (callback) callback();
                else window.location.reload();
            },
            function(error){ alert(error.message) },
            "DELETE",false,false
        );
    },

    recursiveDeletion(table,node)
    {
        const op = table._getTreeOptions();
        let nodeId = node[op.key];
        
        let childs = table.DataArray.filter(row => row[op.parentkey] == nodeId);
        for (let i = 0; i < childs.length; i++) {
            this.recursiveDeletion(table,childs[i]);
        }

        const index = table.DataArray.findIndex(obj => obj[op.key] == nodeId);
        if (index != -1) table.DeleteRow(index);
    },

    getContratos()
    {
        if (Object.keys(this.itemSelected??{}).length == 0) return;

        let pk = this.itemSelected.sys_pk;
        let url = this.path + "?_view=obtener-contratos";
        url += (this.itemSelected.tipo=="unidad") ? "&u="+pk : "&p="+pk;

        fetch(url).then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                return
            }

            contrato.list.tContratos.DataArray = data;
            contrato.list.tContratos._printRows();
        })
        .catch(error => {
            alert(error.message ?? "No fue posible obtener los datos.");
            console.log(error);
        })
    }
}

var contrato =
{
    list: {
        tContratos:null,

        init()
        {
            this.tContratos = document.getElementById("tbl_contratos");

            this.tContratos.hiddeSelector = true;
            this.tContratos.AutoAddRow = false;
            this.tContratos.AutoDelRow = false;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_contrato").addEventListener("click", () => { org.add(); });
            document.getElementById("btn_edt_contrato").addEventListener("click", () => {
                let data = this.tContratos.DataArray[this.tContratos.CurrentRowIndex()];
                if (Object.keys(data??{}).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                org.edt(data.sys_pk);
            });
            document.getElementById("btn_del_contrato").addEventListener("click", () => {
                let index = this.tContratos.CurrentRowIndex();
                let data = this.tContratos.DataArray[index];
                if (Object.keys(data??{}).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                org.del(data.sys_pk, "", () => {
                    this.tContratos.DeleteRow(index);
                });
            });
        },
    },

    form: {
        formContrato: null, elements: null, btnSave: null,

        init()
        {
            this.btnSave = document.getElementById("btn_save");
            this.formContrato = document.getElementById("form_contrato");
            this.elements = this.formContrato.elements;

            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            if (this.btnSave) { this.btnSave.addEventListener("click", () => { this.saveForm(); }); }
            if (this.formContrato)
            {
                this.elements["chq_pagoxhora"].addEventListener("change", (event) => {
                    let gp_pagoxhora = document.getElementById("gp_pagoxhora");
                    if (event.target.checked) {
                        gp_pagoxhora.disabled = false;
                        this.elements["txt_sueldo_diario"].disabled = true;
                    } else {
                        gp_pagoxhora.disabled = true;
                        this.elements["txt_sueldo_diario"].disabled = false;
                    }
                });

                let dMes = 30; //Math.div(365,12);
                this.elements["txt_sueldo_mensual"].addEventListener("input", (event) => {
                    let sMes = Number(event.target.value);
                    let sDia = Math.div(sMes,dMes);
                    this.elements["txt_sueldo_diario"].value = Math.RoundTo(sDia,6);
                });
                this.elements["txt_sueldo_diario"].addEventListener("input", (event) => {
                    let sDia = Number(event.target.value);
                    let sMes = Math.mul(sDia,dMes);
                    this.elements["txt_sueldo_mensual"].value = Math.RoundTo(sMes,4);
                });
                this.elements["txt_sueldo_hora"].addEventListener("input", (event) => {
                    let sHora = Number(event.target.value);
                    let hxDia = Number(this.elements["txt_horas_promedio_dia"].value);
                    let sDia = Math.mul(sHora,hxDia);
                    let sMes = Math.mul(sDia,dMes);

                    this.elements["txt_sueldo_diario"].value = Math.RoundTo(sDia,6);
                    this.elements["txt_sueldo_mensual"].value = Math.RoundTo(sMes,4);
                });
                this.elements["txt_horas_promedio_dia"].addEventListener("input", (event) => {
                    let hxDia = Number(event.target.value);
                    let sHora = Number(this.elements["txt_sueldo_hora"].value);
                    let sDia = Math.mul(sHora,hxDia);
                    let sMes = Math.mul(sDia,dMes);

                    this.elements["txt_sueldo_diario"].value = Math.RoundTo(sDia,6);
                    this.elements["txt_sueldo_mensual"].value = Math.RoundTo(sMes,4);
                });
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    // Salir
                    e.preventDefault();
                    window.location.href = (org.path) ? org.path : "../";
                }
                if (e.key === "F2") {
                    // Agregar nuevo
                    e.preventDefault();
                    if (this._GET["_entity_id"] != "_new") org.add();
                }
                if (e.key === "F6") {
                    // Guardar
                    e.preventDefault();
                    this.elements["shortcut"].value = "F6";
                    this.saveForm();
                }
                if (e.key === "F8") {
                    // Guardar y salir
                    e.preventDefault();
                    this.elements["shortcut"].value = "F8";
                    this.saveForm();
                }
                if (e.key === "F9") {
                    // Guardar y nuevo
                    e.preventDefault();
                    this.elements["shortcut"].value = "F9";
                    this.saveForm();
                }
            });
        },

        saveForm(){
            if (!this.formContrato.reportValidity()) return;
            this.formContrato.submit();
        },
    },
}

var unidad =
{
    list: {
        init()
        {
            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_unidad").addEventListener("click", () => org.add("unidad"));
        },
    },

    form: {
        formUnidad: null, elements: null, btnSave: null,

        init()
        {
            this.btnSave = document.getElementById("btn_save");
            this.formUnidad = document.getElementById("form_unidad");
            this.elements = this.formUnidad.elements;

            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            if (this.btnSave) { this.btnSave.addEventListener("click", () => { this.saveForm(); }); }
            if (this.formUnidad)
            {
                this.elements["chq_depende"].addEventListener("change", (event) => {
                    (event.target.checked)
                        ? this.elements["sel_unidad"].disabled = false
                        : this.elements["sel_unidad"].disabled = true;
                });
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    // Salir
                    e.preventDefault();
                    window.location.href = (org.path) ? org.path : "../";
                }
                if (e.key === "F2") {
                    // Agregar nuevo
                    e.preventDefault();
                    if (this._GET["_entity_id"] != "_new") org.add("unidad");
                }
                if (e.key === "F6") {
                    // Guardar
                    e.preventDefault();
                    this.elements["shortcut"].value = "F6";
                    this.saveForm();
                }
                if (e.key === "F8") {
                    // Guardar y salir
                    e.preventDefault();
                    this.elements["shortcut"].value = "F8";
                    this.saveForm();
                }
                if (e.key === "F9") {
                    // Guardar y nuevo
                    e.preventDefault();
                    this.elements["shortcut"].value = "F9";
                    this.saveForm();
                }
            });
        },

        saveForm(){
            if (!this.formUnidad.reportValidity()) return;
            this.formUnidad.submit();
        },
    },
}

var puesto =
{
    list: {
        init()
        {
            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_puesto").addEventListener("click", () => org.add("puesto"));
        },
    },

    form: {
        formPuesto: null, elements: null, btnSave: null,

        init()
        {
            this.btnSave = document.getElementById("btn_save");
            this.formPuesto = document.getElementById("form_puesto");
            this.elements = this.formPuesto.elements;

            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            if (this.btnSave) { this.btnSave.addEventListener("click", () => { this.saveForm(); }); }
            if (this.formPuesto)
            {
                this.elements["chq_subordinado"].addEventListener("change", (event) => {
                    (event.target.checked)
                        ? this.elements["sel_puesto"].disabled = false
                        : this.elements["sel_puesto"].disabled = true;
                });
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    // Salir
                    e.preventDefault();
                    window.location.href = (org.path) ? org.path : "../";
                }
                if (e.key === "F2") {
                    // Agregar nuevo
                    e.preventDefault();
                    if (this._GET["_entity_id"] != "_new") org.add("puesto");
                }
                if (e.key === "F6") {
                    // Guardar
                    e.preventDefault();
                    this.elements["shortcut"].value = "F6";
                    this.saveForm();
                }
                if (e.key === "F8") {
                    // Guardar y salir
                    e.preventDefault();
                    this.elements["shortcut"].value = "F8";
                    this.saveForm();
                }
                if (e.key === "F9") {
                    // Guardar y nuevo
                    e.preventDefault();
                    this.elements["shortcut"].value = "F9";
                    this.saveForm();
                }
            });
        },

        saveForm(){
            if (!this.formPuesto.reportValidity()) return;
            this.formPuesto.submit();
        },
    },
}