import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-branch-details',
  templateUrl: './branch-details.component.html'
})
export class BranchDetailsComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Boolean
  updateMode: boolean = false;
  // Arrays and Inital Variables
  hideme: any = [];
  employeeRolesArray: any = [];
  branchEmployeesArray: any = [];
  employeesDetailsArray: any = [];
  roleIndex: any = '';
  branch_id: any = '';
  employeeId: any = '';
  employeeEditeName: any = '';
  updatedEmployeeId: any = '';
  branchDetailsData: any = '';
  selectedRoleIndex: any = '';
  selectedEmployeeIndex: any = '';
  editedEmployeeRorleId: any = '';
  optionIndexRoleChange: any = '';
  /* ----------------------------------- Form ------------------------ */
  // Add Employee To Branch Form
  addBranchsEmloyeeForm = new FormGroup({
    role_id: new FormControl(''),
    employee_id: new FormControl('')
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(private api: MainServiceService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.branch_id = params.id;
    });
    this.api.get('branches/' + this.branch_id).subscribe(data => {
      this.branchDetailsData = data.data;
      this.branchEmployeesArray = data.data.employees;
    });
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    // Get Employess Not-Assigned
    this.api.get('employees/index', {}).subscribe(data => {
      this.employeesDetailsArray = data.data.data;
    });
    // Get Employess Roles
    this.api.get('employees/roles', {}).subscribe(data => {
      this.employeeRolesArray = data.data;
    });
  }
  /* ------------------------------- Select Employee ------------------------ */
  selectEmployee(key) {
    if (key === 'role') {
      this.roleIndex = this.addBranchsEmloyeeForm.value.role_id;
      if (this.updateMode) {
        this.selectedRoleIndex = this.addBranchsEmloyeeForm.value.role_id;
      }
    }
    if (key === 'emp') {
      this.employeeId = this.addBranchsEmloyeeForm.value.employee_id;
    }
  }
  /* -------------------------- Select Employee Role ------------------------ */
  seletetEmployeeRoleOption(i) {
    this.selectedRoleIndex = i;
  }
  /* ------------------ Submit Employee Role For Branch --------------------- */
  onSubmit() {
    if (this.updateMode) {
      this.addBranchsEmloyeeForm.value.role_id = this.employeeRolesArray[
        this.optionIndexRoleChange
      ].id;
      this.api
        .put(
          'branches/' + this.branch_id + '/employees/' + this.updatedEmployeeId,
          {
            role_id: this.employeeRolesArray[this.selectedRoleIndex].id
          }
        )
        .subscribe(() => {
          this.api.get('branches/' + this.branch_id).subscribe(data => {
            this.branchDetailsData = data.data;
            this.branchEmployeesArray = data.data.employees;
            this.updateMode = false;
            this.addBranchsEmloyeeForm.controls.role_id.setValue('');
          });
        });
    } else {
      this.addBranchsEmloyeeForm.value.role_id = this.employeeRolesArray[
        this.roleIndex
      ].id;
      this.addBranchsEmloyeeForm.value.employee_id = this.employeesDetailsArray[
        this.employeeId
      ].id;
      this.api
        .post(
          'branches/' + this.branch_id + '/employees',
          this.addBranchsEmloyeeForm.value
        )
        .subscribe(
          value => {
            this.api.get('branches/' + this.branch_id).subscribe(data => {
              this.branchDetailsData = data.data;
              this.branchEmployeesArray = data.data.employees;
              this.addBranchsEmloyeeForm.controls.employee_id.setValue('');
              this.addBranchsEmloyeeForm.controls.role_id.setValue('');
            });
          },
          // tslint:disable-next-line: no-shadowed-variable
          error => {
            this.api.fireAlert('error', error.error.message, '');
          }
        );
    }
  }
  /* -------------------------- Edit Branch Employee ------------------------ */
  editBranchEmployee(updatedEmployeeId) {
    this.updatedEmployeeId = updatedEmployeeId;
    this.updateMode = true;
    for (const employee of this.branchEmployeesArray) {
      if (employee.id === updatedEmployeeId) {
        this.editedEmployeeRorleId = employee.role.id;
        for (const selectedEditedRole of this.employeeRolesArray) {
          if (selectedEditedRole.id === this.editedEmployeeRorleId) {
            this.selectedRoleIndex = this.employeeRolesArray.indexOf(
              selectedEditedRole
            );
            this.addBranchsEmloyeeForm.patchValue({
              role_id: this.employeeRolesArray.indexOf(selectedEditedRole)
            });
            this.optionIndexRoleChange = this.addBranchsEmloyeeForm.controls.role_id.value;
          }
        }
        this.employeeEditeName = employee.name;
      }
    }
  }
  /* ------------------------- Delete Branch Employee ----------------------- */
  deleteEmployeeFromBranch(deletedEmployeeId, branchEmployee) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove ' + branchEmployee.name + ' from this branch ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#373737',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.value) {
        this.api
          .delete(
            'branches/' + this.branch_id + '/employees/' + deletedEmployeeId
          )
          .subscribe(deletedBranch => {
            this.api.get('branches/' + this.branch_id).subscribe(data => {
              this.branchDetailsData = data.data;
              this.branchEmployeesArray = data.data.employees;
            });
          });
      }
    });
  }
}
