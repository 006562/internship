var workflowType = {
    '001': {
        workflowDisplayName: '贵州股权金融资产交易中心《项目》审批流程',
        controlTaskCode: 'TrustGroupMonitorControl',
        monitorTaskCode: 'TrustGroupMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [  ['TrustGroup.BussinessDistribute_CurrentState', 'Pending InputData'],
                            ['TrustGroup.BussinessApproval_CurrentState', 'Pending BPSApproval'],
                            ['TrustGroup.LeaderApproval_CurrentState', 'Pending DGMApproval']
                         ]
    },
    '002': {
        workflowDisplayName: '贵州股权金融资产交易中心《产品》审批流程',
        controlTaskCode: 'TrustMonitorControl',
        monitorTaskCode: 'TrustMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['Trust.TurstDistribute_CurrentState', 'Pending TrustDataInput'],
                            ['Trust.TrustApproval_CurrentState', 'Pending TrustManagerApproval'],
                            ['Trust.TransferInstructionDistribute_CurrentState', 'Pending TrustManagerDistribute'],
                            ['Trust.TransferInstructionApproval_CurrentState', 'Pending TrustTransferInstructionTradingApproval'],
                            ['Trust.TrustFounded_CurrentState', 'Pending TrustTransferInstructionRun']
        ]
    },
    '003': {
        workflowDisplayName: '贵州股权金融资产交易中心《开户》审批流程',
        controlTaskCode: 'TrustAccountMonitorControl',
        monitorTaskCode: 'TrustAccountMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['TrustAccount.BussinessApproval_CurrentState', 'Pending TrustAccountDataInput']
        ]
    },
    '004': {
        workflowDisplayName: '贵州股权金融资产交易中心《兑付申请》审批流程',
        controlTaskCode: 'TrustCashMonitorControl',
        monitorTaskCode: 'TrustCashMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['TrustCash.BussinessApproval_CurrentState', 'Pending TrustCashDataInput'],
                            ['TrustCash.Execute_CurrentState', 'Pending TrustCashPressForMoney']
        ]
    },
    '005': {
        workflowDisplayName: '兑付兑息流程',
        controlTaskCode: 'ApprovalModelMonitorControl',
        monitorTaskCode: 'ApprovalModelMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['ApprovalModel.BussinessApproval_CurrentState', 'Pending ApprovalModelFileGeneration']
        ]
    },
    '006': {
        workflowDisplayName: '信托报告流程',
        controlTaskCode: 'TrustReportApprovalModelMonitorControl',
        monitorTaskCode: 'TrustReportApprovalModelMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['TrustReportApprovalModel.BussinessApproval_CurrentState', 'Pending TrustReportApprovalModelFileGeneration']
        ]
    },
    '007': {
        workflowDisplayName: '分配指令流程',
        controlTaskCode: 'AssignmentCommandModelMonitorControl',
        monitorTaskCode: 'AssignmentCommandModelMonitor',
        controlAppDomain: 'Monitor',
        monitorAppDomain: 'Monitor',
        sourceTaskAppDomain: 'Task',
        sessionVariable: [['AssignmentCommandModel.BussinessApproval_CurrentState', 'Pending AssignmentCommandModelFileGeneration']
        ]
    }
}