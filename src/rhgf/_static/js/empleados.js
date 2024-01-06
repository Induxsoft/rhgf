var empleado =
{
    tableId: "", path: "", table: null,

    init()
    {
        if (this.tableId.trim() != "") { this.table = document.getElementById(this.tableId); }
    },

    trigger(element,event) {
        if (element) {
            let e = new Event(event);
            element.dispatchEvent(e);
        }
    },

    round(num, dec=2) {
        var signo = (num >= 0 ? 1 : -1);
        num = num * signo;
        if (dec === 0) return signo * Math.round(num);
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + dec) : dec)));
        num = num.toString().split('e');
        return signo * (num[0] + 'e' + (num[1] ? (+num[1] - dec) : -dec));
    },

    goTo(url) {
        if (!url) { alert("No se ha indicado un destino."); return; }
        if (!this.table) { alert("No se encontro una definición de tabla (edit-table)."); return; }
        if (this.table.CurrentRowIndex() < 0) { alert("Debe seleccionar una fila"); return; }

        var data = this.table.DataArray[this.table.CurrentRowIndex()];
        window.location.href = url.replace("@empleado",data.sys_pk);
    },

    add()
    {

    },

    list: {
        tEmpleados: null,
        tEvents: {},
        tData: {},
        url_add: "", url_edt: "",
        txt_search_empleado: null,
        btn_search_empleado: null,
        btn_new_empleado: null,

        init()
        {
            this.tEmpleados = document.getElementById("tbl_empleados");
            this.url_add = empleado.path + "_new/";
            this.url_edt = empleado.path + "@empleado/"
            // this.txt_search_empleado = document.getElementById("txt_search_empleado");
            // this.btn_search_empleado = document.getElementById("btn_search_empleado");
            // this.btn_new_empleado = document.getElementById("btn_new_empleado");

            this.tEmpleados.hiddeSelector = true;
            this.tEmpleados.AutoAddRow = false;
            this.tEmpleados.AutoDelRow = false;

            this.tEvents = this.tEmpleados.EdiTable.Const.Events;
            this.tData = this.tEmpleados.DataArray;

            /* this.tEmpleados.Events[this.tEvents.EnterCell] = (e) => {
                let tr = e.td.offsetParent;
                tr.ondblclick = (event) => { empleado.goTo(); }
            }; */

            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            document.getElementById("btn_add").addEventListener("click", (event) => {
                window.location.href = this.url_add;
            });
            document.getElementById("btn_edt").addEventListener("click", (event) => {
                empleado.goTo(this.url_edt);
            });
            document.getElementById("btn_del").addEventListener("click", (event) => {
                if (!confirm("¿Esta seguro que desea eliminar el registro seleccionado?")) return;
                console.log("Registro eliminado.");
            });

            if (this.txt_search_empleado) {
                this.txt_search_empleado.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") this.buscarEmpleado();
                });
            }
            if (this.btn_search_empleado) {
                this.btn_search_empleado.addEventListener("click", () => { this.buscarEmpleado(); });
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    e.preventDefault();
                    window.open("/","_top");
                }
            });
        },

        buscarEmpleado() {
            let text = this.txt_search_empleado.value.trim();
            let url = this.txt_search_empleado.getAttribute("data-url-search").trim();
            if (!text) return;
            if (!url) { alert("No se indico un destino"); return; }
            if (!this.tEmpleados) { alert("No se ha definido la tabla de proveedores."); return; }
            url = url.replace("@search",text);
            
            let onSuccess = (data) => {
                if (data.message) { alert(data.message); return;}
                let div_spnmsg = document.getElementById("div_spnmsg");

                if (Object.entries(data).length == 0) {
                    div_spnmsg.querySelector("#spnmsg").textContent = "No se encontraron resultados.";
                    div_spnmsg.classList.remove("d-none");
                } else {
                    div_spnmsg.querySelector("#spnmsg").textContent = "";
                    div_spnmsg.classList.add("d-none");
                }
                
                this.tData = data;
                this.tEmpleados.DataArray = data;
                this.tEmpleados._printRows();
            }
            let onFailure = (error) => {
                alert('No se pudo realizar la busqueda.\n' + JSON.stringify(error));
            }
    
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false);
        }
    },

    form: {
        _GET: {},
        formProveedor: null,
        elements: null,
        btnSave: null,

        dtProv: {},
        domicilio1: {},
        domicilio2: {},
        domicilio3: {},

        url_buscar_edoprov: "",
        url_buscar_ciudad: "",
        url_buscar_contacto: "",
        CXP_PROVS: "", PDR_AGREGAR: "",
        ipais: 0, iestado: 0, iciudad: 0,
        
        init()
        {
            this.formProveedor = document.getElementById("form_proveedor");
            this.btnSave = document.getElementById("btn_save");
            this.setEvents();
            this.setKeyboardShortcuts();
        },

        setEvents()
        {
            if (this.btnSave) { this.btnSave.addEventListener("click", () => { this.saveForm(); }); }
            if (this.formProveedor) {
                this.elements = this.formProveedor.elements;

                this.elements["chq_domicilio1"].addEventListener("change", (event) => {
                    let domicilio1 = document.getElementById("cbody_domicilio1");
                    (event.target.checked) ? domicilio1.classList.remove("disable-form") : domicilio1.classList.add("disable-form");
                    
                    if (this._GET["_entity_id"] == "_new" || Object.entries(this.domicilio1).length == 0) { this.elements["sel_pais"].value = this.ipais; }
                    else { this.elements["sel_pais"].value = this.domicilio1.ipais; }

                    if (this.elements["sel_estado"].options.length <= 0) this.fillEstados(this.elements["sel_pais"],this.elements["sel_estado"]);
                });
                this.elements["sel_pais"].addEventListener("change", () => {
                    this.fillEstados(this.elements["sel_pais"],this.elements["sel_estado"]);
                });
                this.elements["sel_estado"].addEventListener("change", () => {
                    this.fillCiudades(this.elements["sel_estado"],this.elements["sel_ciudad"]);
                });
                
                this.elements["chq_domicilio2"].addEventListener("change", (event) => {
                    let domicilio2 = document.getElementById("cbody_domicilio2");
                    (event.target.checked) ? domicilio2.classList.remove("disable-form") : domicilio2.classList.add("disable-form");

                    if (this._GET["_entity_id"] == "_new" || Object.entries(this.domicilio2).length == 0) { this.elements["sel_pais2"].value = this.ipais; }
                    else { this.elements["sel_pais2"].value = this.domicilio2.ipais; }

                    if (this.elements["sel_estado2"].options.length <= 0) this.fillEstados(this.elements["sel_pais2"],this.elements["sel_estado2"]);
                });
                this.elements["sel_pais2"].addEventListener("change", () => {
                    this.fillEstados(this.elements["sel_pais2"],this.elements["sel_estado2"]);
                });
                this.elements["sel_estado2"].addEventListener("change", () => {
                    this.fillCiudades(this.elements["sel_estado2"],this.elements["sel_ciudad2"]);
                });

                this.elements["chq_domicilio3"].addEventListener("change", (event) => {
                    let domicilio3 = document.getElementById("cbody_domicilio3");
                    (event.target.checked) ? domicilio3.classList.remove("disable-form") : domicilio3.classList.add("disable-form");

                    if (this._GET["_entity_id"] == "_new" || Object.entries(this.domicilio3).length === 0) { this.elements["sel_pais3"].value = this.ipais; }
                    else { this.elements["sel_pais3"].value = this.domicilio3.ipais; }

                    if (this.elements["sel_estado3"].options.length <= 0) this.fillEstados(this.elements["sel_pais3"],this.elements["sel_estado3"]);
                });
                this.elements["sel_pais3"].addEventListener("change", () => {
                    this.fillEstados(this.elements["sel_pais3"],this.elements["sel_estado3"]);
                });
                this.elements["sel_estado3"].addEventListener("change", () => {
                    this.fillCiudades(this.elements["sel_estado3"],this.elements["sel_ciudad3"]);
                });

                this.elements["chq_otorgar_credito"].addEventListener("change", (event) => {
                    let div_credito = document.getElementById("div_otorgar_credito");
                    (event.target.checked) ? div_credito.classList.remove("disable-form") : div_credito.classList.add("disable-form");
                });
                this.elements["rd_credito_ilimitado"].addEventListener("change", (event) => {
                    this.elements["limitecredito"].type = "hidden";
                });
                this.elements["rd_credito_limitado"].addEventListener("change", (event) => {
                    this.elements["limitecredito"].type = "number";
                });

                if (this._GET["_entity_id"] != "new")
                {
                    let contacto1 = Number(this.dtProv.contacto1);
                    let contacto2 = Number(this.dtProv.contacto2);
                    let contacto3 = Number(this.dtProv.contacto3);

                    if (contacto1 > 0) {
                        let ikContacto1 = document.getElementById("ik_contacto1");
                        this.setContacto(ikContacto1,contacto1);
                    }
                    if (contacto2 > 0) {
                        let ikContacto2 = document.getElementById("ik_contacto2");
                        this.setContacto(ikContacto2,contacto2);
                    }
                    if (contacto3 > 0) {
                        let ikContacto3 = document.getElementById("ik_contacto3");
                        this.setContacto(ikContacto3,contacto3);
                    }
                }
            }
        },

        setKeyboardShortcuts()
        {
            document.addEventListener("keydown", (e) => {
                // console.log("key: "+ e.key + " | " + "code: " + e.code);
                if (e.key === "Escape") {
                    // Salir
                    e.preventDefault();
                    window.location.href = this.CXP_PROVS;
                }
                if (e.key === "F2") {
                    // Agregar nuevo
                    e.preventDefault();
                    if (this._GET["_entity_id"] != "_new") window.location.href = this.PDR_AGREGAR;
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

        fillEstados(ref,out){
            let url = this.url_buscar_edoprov.replace("search","ipais");
            url = InduxsoftCrudlModel.UrlReplace(url,{ipais:ref.value});
            let selected = this.iestado;
            if (this._GET["_entity_id"] != "_new")
            {
                if (out.id == "sel_estado" && Object.entries(this.domicilio1).length > 0) selected = this.domicilio1.iestado;
                else if (out.id == "sel_estado2" && Object.entries(this.domicilio2).length > 0) selected = this.domicilio2.iestado;
                else if (out.id == "sel_estado3" && Object.entries(this.domicilio3).length > 0) selected = this.domicilio3.iestado;
            }

            let onSuccess = (data) => {
                if (data.message) {
                    console.error(data.message);
                    return;
                }

                out.innerHTML = "";
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.sys_pk;
                    option.text = item.text;
                    if (item.sys_pk == selected) option.selected = true;

                    out.appendChild(option);
                });
                proveedor.trigger(out,"change");
            }
            let onFailure = (error) => { console.error(error) }
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false,false);
        },

        fillCiudades(ref,out){
            let url = this.url_buscar_ciudad.replace("search","iestado");
            url = InduxsoftCrudlModel.UrlReplace(url,{iestado:ref.value});
            let selected = this.iciudad;
            if (this._GET["_entity_id"] != "new")
            {
                if (out.id == "sel_ciudad" && Object.entries(this.domicilio1).length > 0) selected = this.domicilio1.iciudad;
                else if (out.id == "sel_ciudad2" && Object.entries(this.domicilio2).length > 0) selected = this.domicilio2.iciudad;
                else if (out.id == "sel_ciudad3" && Object.entries(this.domicilio3).length > 0) selected = this.domicilio3.iciudad;
            }

            let onSuccess = (data) => {
                if (data.message) {
                    console.error(data.message);
                    return;
                }

                out.innerHTML = "";
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.sys_pk;
                    option.text = item.text;
                    if (item.sys_pk == selected) option.selected = true;

                    out.appendChild(option);
                });
            }
            let onFailure = (error) => { console.error(error) }
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false,false);
        },

        setContacto(ik,icontacto){
            let url = this.url_buscar_contacto.replace("search","id");
            url = InduxsoftCrudlModel.UrlReplace(url,{id:icontacto})

            let onSuccess = (data) => {
                if (data.message) { alert(data.message); return; }
                ik.setValue(data);
            }
            let onFailure = (error) => { console.error(error) }
            InduxsoftCrudlModel.InvokeService(url,null,onSuccess,onFailure,"GET",false,false);
        },

        saveForm(){
            if (!this.formProveedor.reportValidity()) return;
            this.formProveedor.submit();
        },
    },
}