var org =
{
    path: "",

    init()
    {
        this.setAjustPanelUnidadEvent();

        contrato.list.init();
        unidad.list.init();
    },

    add(_view="")
    {
        let url_redir = (this.path) ? this.path + "_new/" : "./_new/";
        if (_view.trim() != "") url_redir += _view + "/";
        
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
                if (callback) callback(); else window.location.reload();
            },
            function(error){ console.error(error); },
            "DELETE",false,false
        );
    },

    toggleLeftPanel()
    {
        const tabUnidades = document.querySelector('#unidades_container');
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
}

var contrato =
{
    list: {
        tContratos: null, tEvents: {}, tData: {},

        init()
        {
            this.tContratos = document.getElementById("tbl_contratos");

            this.tContratos.hiddeSelector = true;
            this.tContratos.AutoAddRow = false;
            this.tContratos.AutoDelRow = false;

            this.tEvents = this.tContratos.EdiTable.Const.Events;
            this.tData = this.tContratos.DataArray;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add").addEventListener("click", (event) => { org.add(); });
            document.getElementById("btn_edt").addEventListener("click", (event) => {
                let dt = this.tData[this.tContratos.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                org.edt(dt.sys_pk);
            });
            document.getElementById("btn_del").addEventListener("click", (event) => {
                let currRow = this.tContratos.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la tabla."); return; }
                
                org.del(dt.sys_pk,"",() => {
                    this.tContratos.DeleteRow(currRow);
                    this.tContratos._printRows();
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
        tUnidades: null, tEvents: {}, tData: {},

        init()
        {
            this.tUnidades = document.getElementById("tbl_unidades");

            this.tUnidades.hiddeSelector = true;
            this.tUnidades.AutoAddRow = false;
            this.tUnidades.AutoDelRow = false;
            this.tUnidades.ShowAsTree = true;

            this.tEvents = this.tUnidades.EdiTable.Const.Events;
            this.tData = this.tUnidades.DataArray;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_unidad").addEventListener("click", (event) => { org.add("unidad"); });
            document.getElementById("btn_edt_unidad").addEventListener("click", (event) => {
                let dt = this.tData[this.tUnidades.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                org.edt(dt.sys_pk,"unidad");
            });
            document.getElementById("btn_del_unidad").addEventListener("click", (event) => {
                let currRow = this.tUnidades.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                org.del(dt.sys_pk,"unidad",() => {
                    this.tUnidades.DeleteRow(currRow);
                    this.tUnidades._printRows();
                });
            });
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
        tPuestos: null, tEvents: {}, tData: {},

        init()
        {
            this.tPuestos = document.getElementById("tbl_puestos");

            this.tPuestos.hiddeSelector = true;
            this.tPuestos.AutoAddRow = false;
            this.tPuestos.AutoDelRow = false;
            this.tPuestos.ShowAsTree = true;

            this.tEvents = this.tPuestos.EdiTable.Const.Events;
            this.tData = this.tPuestos.DataArray;

            this.setEvents();
        },

        setEvents()
        {
            document.getElementById("btn_add_puesto").addEventListener("click", (event) => { org.add("puesto"); });
            document.getElementById("btn_edt_puesto").addEventListener("click", (event) => {
                let dt = this.tData[this.tPuestos.CurrentRowIndex()];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                org.edt(dt.sys_pk,"puesto");
            });
            document.getElementById("btn_del_puesto").addEventListener("click", (event) => {
                let currRow = this.tPuestos.CurrentRowIndex();
                let dt = this.tData[currRow];
                if (!dt || Object.entries(dt).length == 0) { alert("Debe seleccionar una fila de la lista."); return; }
                
                org.del(dt.sys_pk,"puesto",() => {
                    this.tPuestos.DeleteRow(currRow);
                    this.tPuestos._printRows();
                });
            });
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