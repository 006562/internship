(function () {
    var VueI18n = {
        install: function (Vue, options) {
            Vue.directive('i18n', function (args) {
                if (args.value != undefined && options[args.language] != undefined) {
                    window.localStorage.language = args.language
                    var val = eval('options.' + args.language + '.' + args.value)
                    if (args.replace != undefined && args.replace.length > 0) {
                        args.replace.forEach(function (v, k) {
                            val = val.replace(new RegExp("\\{" + k + "\\}", "g"), v)
                        })
                    }

                    if (val != undefined) {
                        if (this.modifiers.placeholder) {
                            this.el.setAttribute('placeholder', val)
                        } else if (this.modifiers.title) {
                            this.el.setAttribute('title', val)
                        } else if (this.modifiers.balloon)
                        {
                            this.el.setAttribute('data-balloon', val)
                        } else {
                            this.el.innerHTML = val
                        }
                    } else {
                        this.el.innerHTML = ""
                    }
                } else {
                    this.el.innerHTML = ""
                }
            })
        }
    }
    //if (window.Vue) window.VueI18n = VueI18n;

    // 中英文翻译
    Vue.use(VueI18n, {
        cn: {
            language: '切换到英文',
            title: '现金流计算引擎',
            tab: {
                t1: '现金流模型设计',
                t2: '计算公式'
            },
            searchPanel: '搜索面板',
            search: '搜索',
            tab1: {
                buttons: {
                    b1: '编辑内容',
                    b2: '配置内容',
                    b3: '检验函数代码是否存在',
                    b4: '保存',
                    b5: '刷新',
                    b6: '定义变量',
                    b7: '编辑TaskXML',
                    b8: '运行任务',
                    b9: '显示结果',
                    b10: '清除缓存',
                    code: 'TASK命名',
                },
                work: {
                    d: '输入组',
                    c: '计算组',
                    e: '输出组',
                    a1: '现金流代码',
                    a2: '现金流名称',
                    param: {
                        disName: '现金流名称',
                        code: '现金流代码',
                        funName: '函数名',
                        info: {
                            name: '参数名',
                            spName: '变量',
                            value: '值',
                            dType: '数据类型',
                            usage: '作用域',
                            isConfig: '是否配置'
                        }
                    }
                },
                action: {
                    name: '现金流名称',
                    number: '现金流数量'
                }
            },
            tab2: {
                formula: {
                    title: '公式函数',
                    add: '添加函数',
                    del: '移除函数'
                },
                buttons: {
                    b1: '验证计算',
                    b2: '保存',
                    b3: '刷新',
                    b4: '编辑CaculationXML',
                    code: 'EC命名'
                },
                work: {
                    name: '函数代码',
                    disName: '函数描述',
                    param: {
                        title: '参数集合',
                        info: {
                            name: '参数名',
                            spName: '变量',
                            value: '值',
                            dType: '数据类型',
                            fName: '现金流代码',
                            position: '期数'
                        }
                    },
                    equation: '计算公式'
                },
                caculationTools: {
                    title: '计算工具',
                }
            }
        },
        en: {
            language: 'Swicth to Chinese',
            title: 'CashFlow Studio',
            tab: {
                t1: 'Task View',
                t2: 'Caculation View'
            },
            search: 'search',
            searchPanel: 'search Panel',
            tab1: {
                buttons: {
                    b1: 'ShowContent',
                    b2: 'ShowSimpleContent',
                    b3: 'Check Code',
                    b4: 'SaveTask',
                    b5: 'RefreshTask',
                    b6: 'PopVariablePannel',
                    b7: 'XML',
                    b8: 'RunTask',
                    b9: 'Displayer',
                    b10: 'ClearLocalStorage',
                    code: 'New Task Code',
                },
                work: {
                    d: 'DirectInput',
                    c: 'Calculated',
                    e: 'Export',
                    a1: 'ActionCode',
                    a2: 'ActionDisplayName',
                    param: {
                        disName: 'ActionDisplayName',
                        code: 'ActionCode',
                        funName: 'FunctionName',
                        info: {
                            name: 'Name',
                            spName: 'SessionParameterName',
                            value: 'Value',
                            dType: 'DataType',
                            usage: 'Usage',
                            isConfig: 'IsConfig'
                        }
                    }
                },
                action: {
                    name: 'ActionDisplayName',
                    number: 'ActionNumber'
                }
            },
            tab2: {
                formula: {
                    title: 'Formula Organizer',
                    add: 'Add',
                    del: 'Remove'
                },
                buttons: {
                    b1: 'Verify',
                    b2: 'Save',
                    b3: 'Refresh',
                    b4: 'XML',
                    code: 'New Criteria Code'
                },
                work: {
                    name: 'Name',
                    disName: 'DisplayName',
                    param: {
                        title: 'Parameters',
                        info: {
                            name: 'Name',
                            spName: 'SessionParameterName',
                            value: 'Value',
                            dType: 'DataType',
                            fName: 'FieldName',
                            position: 'Position'
                        }
                    },
                    equation: 'Equation'
                },
                caculationTools: {
                    title: 'Caculation Tools'
                }
            }
        }
    });

})();
