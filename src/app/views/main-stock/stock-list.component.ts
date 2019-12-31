import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  templateUrl: 'stock-list.component.html'
})
export class StockListComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('detailsModal', { static: false })
  public detailsModal: ModalDirective;
  @ViewChild('labelModal', { static: false })
  public labelModal: ModalDirective;
  @ViewChild('editModal', { static: false })
  public editModal: ModalDirective;
  @ViewChild('stoneModal', { static: false })
  public stoneModal: ModalDirective;
  @ViewChild('deleteModal', { static: false })
  public deleteModal: ModalDirective;
  @ViewChild('delete2Modal', { static: false })
  public delete2Modal: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  // Tables Colums
  displayedColumns: string[] = [
    'select',
    'img',
    'category.name',
    'label',
    'branch.name',
    'gold_weight',
    'item_total_after_profit',
    'created_at',
    'status.name',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Boolean
  showDetailsPopup: boolean = false;
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  checkItemDataCalculatedIsDefiend: boolean = false;
  testValueBoolean: boolean = true;
  stoneFlage: boolean = false;
  flage: boolean = false;
  // ASYNC
  filteredBranches: Observable<string[]>;
  filteredCategories: Observable<string[]>;
  filteredCodes: Observable<string[]>;
  filteredStatus: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  statusList: any = [];
  pageNumbers: any = [];
  categoryList: any = [];
  productNumbersList: any = [];
  stones: any = [];
  data: any;
  codeList: any;
  branchList: any;
  deleteItem: any;
  deletedStockIndex: any;
  stoneTotal: any;
  stonePrice: any;
  stonesArray: any;
  stoneSetting: any;
  newPriceValue: any;
  newWeightValue: any;
  newSettingValue: any;
  newQuantityValue: any;
  newGoldPriceValue: any;
  newGoldWeightValue: any;
  ItemDataCalculated: any = {};
  stoneList: any = [];
  modalError: any = [];
  newStoneArray: any = [];
  testStonesArray: any = [];
  label: any = '';
  stockData: any = {};
  labelData: any = {};
  updatedItemData: any = {};
  branch_id: any = '';
  status_id: any = '';
  category_id: any = '';
  codeValue: string = '';
  tem_category: any = '';
  branchValue: string = '';
  categoryValue: string = '';
  statusValue: string = '';
  status: string = '';
  category: string = '';
  branch: string = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.ixscope.com/backend/img/products/';
  transferName: any = '';
  transferCode: any = '';
  imgSrc: any = '';
  per_page: number = 50;
  pageEvent: any;
  totalSearch: any = '';
  totalCost: any = '';
  finalCost: any = '';
  productTransferID: any;
  checkedItems: any = 0;
  stone_id: any = '';
  // Form Controls
  myControlBranch = new FormControl('');
  myControlCategory = new FormControl('');
  myControlCode = new FormControl('');
  myControlStatus = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  selectNumberOfProductForm = new FormGroup({
    numberOfProducts: new FormControl('')
  });
  // Transfer Form
  transferForm = new FormGroup({
    branch_id: new FormControl('', Validators.required)
  });
  // Stock Form
  stockUpdatForm = new FormGroup({
    updateStockTotalPrice: new FormControl(''),
    updateGoldWeight: new FormControl(''),
    updateGoldPrice: new FormControl(''),
    updateStonesQuantity: new FormControl(''),
    updateSettingsSetting: new FormControl(''),
    updateStonesWeight: new FormControl(''),
    updateStonesPrice: new FormControl(''),
    goldTotalPrice: new FormControl(''),
    stoneTotal: new FormControl(''),
    stoneTotal1: new FormControl(''),
    stoneTotal2: new FormControl('')
  });
  // Add New Stone Form
  stonesForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    setting: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    total: new FormControl('')
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // --------------------------------------  Get Branches
      this.branchList = data.branchList.data;
      // -------------------------------------- Get Categories
      this.categoryList = data.categoryList.data;
      // --------------------------------------- Get Products
      this.products = data.productsData.data.data;
      this.data = Object.assign(data.productsData.data.data);
      this.totalSearch = data.productsData.data.total;
      this.dataSource = new MatTableDataSource(data.productsData.data.data);
      console.log(data.productsData.data.last_page);
      console.log(this.pageNumbers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category.name':
            return item.category.name;
          case 'branch.name':
            return item.branch.name;
          case 'status.name':
            return item.status.name;
          default:
            return item[property];
        }
      };
      // -------------------------------------- Get Status
      this.statusList = data.statusList.data;
      // -------------------------------------- Get Status
      this.stoneList = data.stones.data.data;
      console.log(this.stoneList);
    });
    // Filter Branches
    this.filteredBranches = this.myControlBranch.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBranch(value))
    );
    // Filter Categories
    this.filteredCategories = this.myControlCategory.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCategory(value))
    );
    // Filter Codes
    this.filteredCodes = this.myControlCode.valueChanges.pipe(
      startWith(''),
      map(value => this.fitlerCode(value))
    );
    // Filter Status
    this.filteredStatus = this.myControlStatus.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStatus(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /* ---------------------------- Filter Branches ------------------------ */
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.branch_id = '';
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      this.branch_id = value.id;
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.branch.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category.name':
            return item.category.name;
          case 'branch.name':
            return item.branch.name;
          case 'status.name':
            return item.status.name;
          default:
            return item[property];
        }
      };
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Branches ------------------------ */
  displayBranch(branch): string {
    return branch ? branch.name : branch;
  }
  /* ---------------------------- Filter Categories ------------------------ */
  private filterCategory(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.category_id = '';
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      this.category_id = value.id;
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.categoryList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.category.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category.name':
            return item.category.name;
          case 'branch.name':
            return item.branch.name;
          case 'status.name':
            return item.status.name;
          default:
            return item[property];
        }
      };
      return this.categoryList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Categories ------------------------ */
  displayCategory(category): string {
    return category ? category.name : category;
  }
  /* ---------------------------- Filter Codes ------------------------ */
  private fitlerCode(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.label = '';
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.label.toLowerCase();
      this.label = value.label;
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.filter(option =>
        option.label.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.label.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category.name':
            return item.category.name;
          case 'branch.name':
            return item.branch.name;
          case 'status.name':
            return item.status.name;
          default:
            return item[property];
        }
      };
      return this.products.filter(option =>
        option.label.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Codes ------------------------ */
  displayCode(code): string {
    console.log(code);
    return code ? code.label : code;
  }
  /* ---------------------------- Filter Status ------------------------ */
  private filterStatus(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.status_id = '';
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      this.status_id = value.id;
      // Send Request
      this.api
        .get('products', {
          branch_id: this.branch_id,
          category_id: this.category_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.statusList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.status.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category.name':
            return item.category.name;
          case 'branch.name':
            return item.branch.name;
          case 'status.name':
            return item.status.name;
          default:
            return item[property];
        }
      };
      return this.statusList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Status ------------------------ */
  displayStatus(status): string {
    return status ? status.name : status;
  }
  /* -------------------------------- Checkbox---------------------------- */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.flage = false;
      this.selection.clear();
    } else {
      this.flage = true;
      this.checkedItems = this.selection.selected.length;
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    console.log(this.flage);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    this.checkedItems = this.selection.selected.length;
    if (!row) {
      this.flage = true;
      // console.log(this.flage);
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      this.flage = false;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }
  /* ---------------------------- Remove Multi-Items ----------------------- */
  mutliplyAction(event) {
    this.flage = event.checked;
    this.checkedItems = this.selection.selected.length;
  }
  removeMultiply() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    if (upperDeleteInputValue === 'DELETE') {
      const ids = [];
      this.selection.selected.forEach(item => {
        const index: number = this.data.findIndex(d => d === item);
        ids.push(item.id);
      });
      this.checkedItems = 0;
      this.selection.clear();
      this.api
        .delete('products', { params: { 'ids[]': ids } })
        .subscribe(data => {
          this.toast.success('The Items are Successfully delete', '!Success');
          this.api.get('products').subscribe(value => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          });
        });
    }
  }
  /* ------------------------------------ Popup ----------------------------- */
  // Open Details Popup
  openDetailsPopup(row) {
    this.detailsModal.show();
    this.stockData = row;
    this.labelData = row;
    console.log(this.stockData);
    this.status = row.status.name;
    this.category = row.category.name;
    this.branch = row.branch.name;
    this.stones = row.stones;
    const sum = [];
    row.stones.filter(stone => {
      sum.push(stone.total);
    });
    const total = sum.reduce((a, b) => a + b, 0);
    this.totalCost = total + row.gold_total;
    this.finalCost = Math.ceil(this.totalCost * row.profit_percent);
  }
  // Open Label
  openLabel(row) {
    this.labelModal.show();
    this.labelData = row;
  }
  // Open Edit Popup
  openUpdataPopup(stockData, stockId) {
    this.stockData = stockData;
    this.updatedItemData = this.stockData;
    this.editModal.show();
    console.log(stockData);
    this.category = stockData.category.name;
    this.branch = stockData.branch.name;
    this.stones = stockData.stones;
    this.stones = stockData.stones;
    const sums = [];
    stockData.stones.filter(stone => {
      sums.push(stone.total);
    });
    const total = sums.reduce((a, b) => a + b, 0);
    this.totalCost = total + stockData.gold_total;
    this.finalCost = Math.ceil(this.totalCost * stockData.profit_percent);
    this.showUpdataPopup = true;
    this.ItemDataCalculated = Object.assign({}, this.updatedItemData);
    for (let i = 0; i < this.ItemDataCalculated.length; i++) {}
    const items = this.updatedItemData.stones;
    let sum = null;
    items.forEach((value, index, arry) => {
      sum += value.total;
    });
    if ((this.testValueBoolean = false)) {
      this.newStoneArray = [];
    }
    const data = this.updatedItemData;
    this.imgSrc = this.baseUrl + data.image;
    this.stonePrice = +data.price;
    this.stoneSetting = +data.setting;
    this.stockUpdatForm.controls.updateGoldWeight.setValue(+data.gold_weight);
    this.stockUpdatForm.controls.updateGoldPrice.setValue(+data.gold_price);
    this.stockUpdatForm.controls.goldTotalPrice.setValue(+data.gold_total);
    this.testStonesArray = data.stones;
  }
  /* --------------------- Total Calculate Stone Total ---------------------- */
  calculateStoneTotal(e, stoneIndex, key) {
    console.log(stoneIndex);

    this.checkItemDataCalculatedIsDefiend = true;
    if (this.ItemDataCalculated.stones.length > 0) {
      this.stonesArray = this.ItemDataCalculated.stones;
      if (key === 'gW') {
        this.newGoldWeightValue = e.target.value;
        this.ItemDataCalculated.gold_weight = this.newGoldWeightValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      if (key === 'gP') {
        this.newGoldPriceValue = e.target.value;
        this.ItemDataCalculated.gold_price = this.newGoldPriceValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      } else {
        if (key === 'sQ') {
          this.newQuantityValue = e.target.value;
          this.stonesArray[stoneIndex].quantity = this.newQuantityValue;
        }
        if (key === 'sW') {
          this.newWeightValue = e.target.value;
          this.stonesArray[stoneIndex].weight = this.newWeightValue;
        }
        if (key === 'sP') {
          this.newPriceValue = e.target.value;
          this.stonesArray[stoneIndex].price = this.newPriceValue;
        }
        if (key === 'sS') {
          this.newSettingValue = e.target.value;
          this.stonesArray[stoneIndex].setting = this.newSettingValue;
        }
        const stoneTotal =
          this.stonesArray[stoneIndex].quantity *
            this.stonesArray[stoneIndex].setting +
          this.stonesArray[stoneIndex].weight *
            this.stonesArray[stoneIndex].price;
        // Set New Stone
        this.stonesArray[stoneIndex].total = stoneTotal;
      }
      // Start Calculate Total of Stone Total
      const items = this.ItemDataCalculated.stones;
      let sum = null;
      items.forEach(value => {
        sum += value.total;
      });
      // End Calculate Total of Stone Total
      this.ItemDataCalculated.item_total =
        this.ItemDataCalculated.gold_total + sum;
      this.ItemDataCalculated.item_total_after_profit = Math.ceil(
        this.ItemDataCalculated.item_total *
          this.ItemDataCalculated.profit_percent
      );
    } else {
      if (key === 'gW') {
        this.newGoldWeightValue = e.target.value;
        this.ItemDataCalculated.gold_weight = this.newGoldWeightValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      if (key === 'gP') {
        this.newGoldPriceValue = e.target.value;
        this.ItemDataCalculated.gold_price = this.newGoldPriceValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      this.ItemDataCalculated.item_total = Math.round(
        Math.ceil(this.ItemDataCalculated.gold_total)
      );
      this.ItemDataCalculated.item_total_after_profit = Math.round(
        Math.ceil(
          this.ItemDataCalculated.item_total *
            this.ItemDataCalculated.profit_percent
        )
      );
    }
  }
  /* --------------------------- Number Validation ------------------------ */
  numberCheckValidation(e) {
    if ((48 <= e.keyCode && e.keyCode <= 57) || e.keyCode === 46) {
    } else {
      return false;
    }
  }
  getSelectedListOptionId() {
    // Get Stone Name
    const name = this.stonesForm.value.name;
    for (const stone of this.stoneList) {
      if (name === stone.name) {
        console.log(stone);
        this.stone_id = stone.id;
        console.log(this.stone_id);
      }
    }
  }
  /* ---------------------------------- Remove Stone ------------------------ */
  removeStone(i) {
    this.checkItemDataCalculatedIsDefiend = true;
    this.testStonesArray.splice(i, 1);
    // Start Calculate Total of Stone Total
    const items = this.ItemDataCalculated.stones;
    let sum = null;
    items.forEach(value => {
      sum += value.total;
    });
    // End Calculate Total of Stone Total
    this.ItemDataCalculated.item_total =
      this.ItemDataCalculated.gold_total + sum;
    this.ItemDataCalculated.item_total_after_profit = Math.ceil(
      this.ItemDataCalculated.item_total *
        this.ItemDataCalculated.profit_percent
    );
  }
  /* ------------------------------ Create New Stone ------------------------ */
  onSubmitStone(form) {
    this.newStoneArray = this.testStonesArray;
    form.value.id = this.stone_id;
    form.value.total = Math.ceil(
      form.value.quantity * form.value.price +
        form.value.weight * form.value.setting
    );
    if (
      form.value.name &&
      form.value.price &&
      form.value.quantity &&
      form.value.setting &&
      form.value.weight
    ) {
      this.checkItemDataCalculatedIsDefiend = true;
      this.stoneFlage = true;
      this.newStoneArray.push(form.value);
      this.stoneModal.hide();
      const items = this.ItemDataCalculated.stones;
      let sum = null;
      items.forEach(value => {
        sum += value.total;
      });
      this.ItemDataCalculated.item_total =
        this.ItemDataCalculated.gold_total + sum;
      this.ItemDataCalculated.item_total_after_profit = Math.ceil(
        this.ItemDataCalculated.item_total *
          this.ItemDataCalculated.profit_percent
      );
    } else {
      this.api.fireAlert('error', 'Please Fill in All Data', '');
    }
    this.stone_id = '';
  }
  /* --------------------- Update Item ---------------------- */
  onSubmit(form) {
    // tslint:disable-next-line: no-unused-expression
    this.stoneFlage === true;
    if (this.stoneFlage === true) {
      console.log('New Stones Add');
    } else {
      this.newStoneArray = [];
    }
    this.updatedItemData = this.ItemDataCalculated;
    if (this.updatedItemData.stones.length === 0) {
      delete this.updatedItemData.stones;
    }
    this.api
      .put('products/' + this.updatedItemData.id, this.updatedItemData)
      .subscribe(value => {
        this.toast.success(
          this.updatedItemData.label + ' ' + ' was successfully Updated',
          'Success!',
          {
            timeOut: 1000
          }
        );
        setTimeout(() => {
          this.editModal.hide();
          location.reload();
        }, 1000);
      });
  }
  // Close Edit Popup
  closeUpdataPopup() {
    this.showUpdataPopup = false;
  }
  // Open Delete Popup
  opendeletePopup(row) {
    this.deleteForm.controls.deleteInput.setValue('');
    console.log(row);
    this.deleteItem = row;
    this.deleteModal.show();
  }
  // Close Delete Popup
  closeDeletePopup() {
    this.deleteForm.controls.deleteInput.setValue('');
    this.showDeletePopup = false;
  }
  /* -------------------------- Delete Item ----------------------------- */
  deleteStock() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    const perPageValue = this.selectNumberOfProductForm.value.numberOfProducts;
    if (upperDeleteInputValue === 'DELETE') {
      console.log('Deleted One Item');
    } else {
      this.api.fireAlert('error', 'Error in writing delete', '');
    }
    console.log(this.deleteFlage);
    if (!this.deleteFlage) {
      this.api.delete('products/' + this.deleteItem.id).subscribe(value => {
        // tslint:disable-next-line: triple-equals
        if (value['status'] == 'success') {
          this.toast.success(
            this.deleteItem.label + ' ' + 'has been Deleted',
            'Success!'
          );
          this.api
            .get('products', {
              per_page: 50
            })
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe(value => {
              this.dataSource = new MatTableDataSource(value.data.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                  case 'category.name':
                    return item.category.name;
                  case 'branch.name':
                    return item.branch.name;
                  case 'status.name':
                    return item.status.name;
                  default:
                    return item[property];
                }
              };
            });
        }
        this.DeletingHold = false;
        this.showDeletePopup = false;
        return this.products;
      });
    } else {
      this.showDeletePopup = true;
      if (upperDeleteInputValue === 'DELETE') {
        this.removeMultiply();
      }
    }
  }
  // Reload Page
  reloadPage() {
    console.log('Reload Popup');
  }
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    this.api
      .get('products', {
        per_page: event.pageSize
      })
      .subscribe((productList: any) => {
        console.log(productList.data.data);
        this.products = productList.data.data;
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'category.name':
              return item.category.name;
            case 'branch.name':
              return item.branch.name;
            case 'status.name':
              return item.status.name;
            default:
              return item[property];
          }
        };
      });
  }
  /* -------------------------- Open Image Modal ---------------------------- */
  openImage(event) {
    this.myModalImg.show();
    this.imgSrc = event.src;
  }
  /* -------------------------- Transfer Action ---------------------------- */
  onSubmitTransfer(form) {
    this.api
      .put('branches/' + form.value.branch_id + '/transfer', {
        product_id: this.productTransferID
      })
      .subscribe(val => {
        this.toast.success(
          'The product has been successfully transfered',
          '!Success'
        );
        this.api
          .get('products', {
            branch_id: this.branch_id,
            category_id: this.category_id,
            label: this.label,
            status_id: this.status_id,
            per_page: 50
          })
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe(value => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'category.name':
                  return item.category.name;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          });
        this.myModal.hide();
      });
  }
  /* -------------------------- Transfer Data Show -------------------------- */
  getData(row) {
    console.log('Item To Sale : ', row);
    this.productTransferID = row.id;
    this.transferName = row.branch.name;
    this.transferCode = row.label;
  }
  /* -------------------------- Invoice Action ---------------------------- */
  routeToSale(row) {
    console.log('Item To Sale: ', row);
    this.router.navigate(['/sales/make-new-sale'], {
      queryParams: { id: row.id },
      skipLocationChange: true
    });
  }
  /* ------------------------- Refund Action ---------------------------- */
  routeToReturn(row) {
    console.log('Item To Return: ', row);
    this.router.navigate(['/sales/return'], {
      queryParams: { id: row.id },
      skipLocationChange: true
    });
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  /* ------------------------------------- Print ---------------------------- */ print() {
    this.detailsModal.hide();
    this.labelModal.show();
    setTimeout(() => {
      window.print();
    }, 500);
  }
}
