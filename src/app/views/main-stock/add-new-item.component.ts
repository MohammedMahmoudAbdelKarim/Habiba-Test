import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainServiceService } from './../../shared-services/main-service.service';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  templateUrl: 'add-new-item.component.html'
})
export class AddNewItemComponent {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  /* ------------------------------------- Form ------------------------ */
  // Main Form
  addStockForm = new FormGroup({
    product_date: new FormControl('', Validators.required),
    branch_id: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
    label: new FormControl(''),
    gold_price: new FormControl('', Validators.required),
    gold_weight: new FormControl('', Validators.required),
    image: new FormControl(''),
    stones: new FormControl('', Validators.required),
    metal_type: new FormControl('', Validators.required)
  });
  // Factor Form
  factorForm = new FormGroup({
    factor: new FormControl('')
  });
  // Stone Form
  addStockStoneForm = new FormGroup({
    stone: new FormControl('', Validators.required),
    stone_cost: new FormControl('', Validators.required),
    stone_weight: new FormControl('', Validators.required),
    stone_setting: new FormControl('', Validators.required),
    stone_quantity: new FormControl('', Validators.required)
  });
  // Category Form
  categoriesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required)
  });
  // Branch Form
  branchesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city_id: new FormControl('', Validators.required)
  });
  metalFlage: boolean = false;
  imageDeleted: boolean = false;
  editStoneMode: boolean = false;
  imageUploadedDisplay: boolean = false;
  imageUploadedOnInput: boolean = true;
  sentImage: any;
  imageFile: any;
  StochImage: any;
  goldTotalPice: any;
  imageExtention: any;
  editeStoneName: any;
  GoldPriceValue: any;
  editstoneIndex: any;
  goldPriceValue: any;
  sentFormStoneId: any;
  sentProductDate: any;
  goldWeightValue: any;
  GoldWeightValue: any;
  citiesListArray: any;
  sentFormBranchId: any;
  sentFormCategotyId: any;
  editeStoneNameIndex: any;
  imageEncodedCharachter: any;
  imageBase64StringCharacter: any;
  stonesTotalPrice: any = 0;
  totalCostWithProfit: any = 0;
  totalCostWithOutProfit: any = 0;
  metals: any = [];
  stoneList: any = [];
  modalError: any = [];
  errorMessage: any = [];
  branchesList: any = [];
  categoriesList: any = [];
  sentStonesArray: any = [];
  base64textString: any = [];
  imagePlaceHolder: any = 'Stock Image';
  stonAreaPlaceHolder: any = 'No Stones Added Yet';
  ImageSrc: any = '../../../assets/default.png';
  label: any = '';
  entryDate: any = '-';
  metal_types: any = '';
  CategoryCode: any = '';
  categoryLabel: any = '';
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // Get Branches
      this.branchesList = data.branchList.data;
      // Get Stones
      this.stoneList = data.stoneList.data;
      // Get Categories
      this.categoriesList = data.categoryList.data;
      // Get Cities
      this.citiesListArray = data.city.data;
      // Get Metal Types
      this.metals = data.metal.data;
    });
  }
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() { }
  /* ----------------------------------- Open Modal ------------------------ */
  openModel(template: TemplateRef<any>) {
    this.categoriesForm.reset();
  }
  /* ----------------------- Get Auto-Generated Label ---------------------- */
  onChangeCategory(event) {
    const id = Number(event);
    this.api.get('products/next-label', { category_id: id }).subscribe(val => {
      this.categoryLabel = val.data.next_label_number.toString();
      this.label = this.CategoryCode + '00' + this.categoryLabel;
    });
  }
  /* ----------------------- Create New Category ---------------------- */
  onSubmitCat(form) {
    this.api.post('categories', form.value).subscribe(
      value => {
        // tslint:disable-next-line: no-shadowed-variable
        this.api.get('categories/active').subscribe(value => {
          this.categoriesList = value.data;
        });
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal.hide();
        this.api.get('categories/active').subscribe(data => {
          // Get Categories
          this.categoriesList = data.data;
        });
      },
      // Catch Error
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ------------- Clear Error Message When Modal Opened ------------------ */
  clearError() {
    this.modalError = [];
  }
  /* ----------------------- Create New Branch ---------------------- */
  onSubmitBranch(form) {
    this.api.post('branches', form.value).subscribe(
      value => {
        // tslint:disable-next-line: no-shadowed-variable
        this.api.get('branches/active').subscribe(value => {
          this.branchesList = value.data;
        });
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal2.hide();
      },
      // Catch Error
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ----------------------- Change Data Format ---------------------- */
  entryDateChanged(event, type) {
    let entryDateArray = [];
    entryDateArray = event.targetElement.value.split('/');
    this.entryDate =
      entryDateArray[1] + '/' + entryDateArray[0] + '/' + entryDateArray[2];
    this.sentProductDate =
      entryDateArray[2] + '/' + entryDateArray[0] + '/' + entryDateArray[1];
  }
  /* ----------------------- Change Data Format ---------------------- */
  calculateTotal(e, stoneIndex, key) {
    if (key === 'gW') {
      this.GoldWeightValue = e.target.value;
      this.addStockForm.value.gold_weight = this.GoldWeightValue;
      this.goldTotalPice =
        this.GoldWeightValue * this.addStockForm.value.gold_price;
    }
    if (key === 'gP') {
      this.GoldPriceValue = e.target.value;
      this.addStockForm.value.gold_price = this.GoldPriceValue;
      this.goldTotalPice =
        this.GoldPriceValue * this.addStockForm.value.gold_weight;
    }
    this.totalCostWithOutProfit = this.goldTotalPice + +this.stonesTotalPrice;
    this.totalCostWithProfit = Math.ceil(
      this.totalCostWithOutProfit * this.factorForm.controls.factor.value);
  }
  /* ----------------------- Number Validation ---------------------- */
  numberCheckValidation(e) {
    if ((48 <= e.keyCode && e.keyCode <= 57) || e.keyCode === 46) {
    } else {
      return false;
    }
  }
  /* ---------------- Get IDs of Category , Branch, Stones ------------------ */
  getSelectedListOptionId(key) {
    // Get Category Name
    if (key === 'category') {
      const categorySelectedName = Number(this.addStockForm.value.category_id);
      for (const category of this.categoriesList) {
        if (categorySelectedName === category.id) {
          this.sentFormCategotyId = category.name;
          if (category) {
            this.CategoryCode = category.code;
            // tslint:disable-next-line: triple-equals
            if (this.CategoryCode != undefined) {
              this.label = this.CategoryCode + this.categoryLabel;
            } else {
              this.label = '';
            }
          }
        }
      }
    }
    // Get Branch Name
    if (key === 'branch') {
      const branchSelectedName = Number(this.addStockForm.value.branch_id);
      for (const branch of this.branchesList) {
        if (branchSelectedName === branch.id) {
          this.sentFormBranchId = branch.name;
        }
      }
    }
    // Get Stone Name
    if (key === 'stone') {
      const stoneSelectedName = this.addStockStoneForm.value.stone;
      for (const stone of this.stoneList) {
        if (stoneSelectedName === stone.name) {
          const stoneIndex = this.stoneList.indexOf(stone);
          this.sentFormStoneId = stone.id;
          this.addStockStoneForm.patchValue({
            stone_cost: stone.price,
            stone_setting: stone.setting
          });
        }
      }
    }
  }
  /* ----------------------- Add Stone to Item ---------------------- */
  addStoneToItem(form) {
    if (this.editStoneMode) {
      (this.sentStonesArray[this.editstoneIndex].id = this.sentFormStoneId),
        (this.sentStonesArray[
          this.editstoneIndex
        ].setting = this.addStockStoneForm.value.stone_setting);
      this.sentStonesArray[
        this.editstoneIndex
      ].price = this.addStockStoneForm.value.stone_cost;
      this.sentStonesArray[
        this.editstoneIndex
      ].weight = this.addStockStoneForm.value.stone_weight;
      this.sentStonesArray[
        this.editstoneIndex
      ].quantity = this.addStockStoneForm.value.stone_quantity;
      this.sentStonesArray[
        this.editstoneIndex
      ].type_name = this.addStockStoneForm.value.stone;
      this.sentStonesArray[this.editstoneIndex].total =
        this.addStockStoneForm.value.stone_cost *
        this.addStockStoneForm.value.stone_weight +
        this.addStockStoneForm.value.stone_quantity *
        this.addStockStoneForm.value.stone_setting;
      this.editStoneMode = false;
    } else {
      this.sentStonesArray.push({
        id: this.sentFormStoneId,
        setting: this.addStockStoneForm.value.stone_setting,
        price: this.addStockStoneForm.value.stone_cost,
        weight: this.addStockStoneForm.value.stone_weight,
        quantity: this.addStockStoneForm.value.stone_quantity,
        type_name: this.addStockStoneForm.value.stone,
        total:
          this.addStockStoneForm.value.stone_cost *
          this.addStockStoneForm.value.stone_weight +
          this.addStockStoneForm.value.stone_quantity *
          this.addStockStoneForm.value.stone_setting
      });
    }
    this.addStockStoneForm.patchValue({
      stone: '',
      stone_quantity: '',
      stone_weight: '',
      stone_cost: '',
      stone_setting: ''
    });
    // Start Sum Stones
    const items = this.sentStonesArray;
    let sum = null;
    items.forEach(value => {
      sum += value.total;
    });
    this.stonesTotalPrice = +sum;
    this.totalCostWithOutProfit = this.goldTotalPice + +this.stonesTotalPrice;
    // End Sum Stones
  }
  /* ----------------------- Image Convet to Base64 ---------------------- */
  // 1
  onUploadChange(evt: any) {
    this.imageFile = evt.target.files[0];
    this.StochImage = evt.target.files[0];
    if (this.imageFile) {
      this.imagePlaceHolder = this.imageFile.name;
      this.imageUploadedOnInput = false;
      const ImageNameSplitedArray = this.imagePlaceHolder.split('.');
      this.imageExtention = ImageNameSplitedArray[1];
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.imageFile);
    }
    if (
      // tslint:disable-next-line: triple-equals
      evt.target.files[0].type != 'image/jpg' &&
      // tslint:disable-next-line: triple-equals
      evt.target.files[0].type != 'image/png' &&
      // tslint:disable-next-line: triple-equals
      evt.target.files[0].type != 'image/jpeg' &&
      // tslint:disable-next-line: triple-equals
      evt.target.files[0].type != 'image/gif'
    ) {
      this.api.fireAlert('error', 'Invalid image upload', '');
    }
  }
  // 2
  handleReaderLoaded(e) {
    this.imageUploadedDisplay = true;
    this.addStockForm.patchValue({
      image: btoa(e.target.result)
    });
    this.imageBase64StringCharacter = btoa(e.target.result);
    this.ImageSrc = 'data:image/png;base64,' + this.imageBase64StringCharacter;
  }
  /* ------------------------------- Edit Stone ----------------------------- */
  editStone(editStoneIndex) {
    this.editstoneIndex = editStoneIndex;
    this.editStoneMode = true;
    for (const editStone of this.stoneList) {
      if (editStone.id === this.sentStonesArray[editStoneIndex].id) {
        this.editeStoneName = editStone.name;
        this.editeStoneNameIndex = this.stoneList.indexOf(editStone);
      }
    }
    this.addStockStoneForm.patchValue({
      stone: this.editeStoneName,
      stone_quantity: this.sentStonesArray[editStoneIndex].quantity,
      stone_weight: this.sentStonesArray[editStoneIndex].weight,
      stone_setting: this.sentStonesArray[editStoneIndex].setting,
      stone_cost: this.sentStonesArray[editStoneIndex].price
    });
  }
  /* ----------------------------- Delete Stone ----------------------------- */
  deleteFunction(key, index) {
    if (key === 'deleteStone') {
      const deletedStoneIndex = index;
      this.totalCostWithOutProfit =
        this.totalCostWithOutProfit -
        this.sentStonesArray[deletedStoneIndex].total;
      this.totalCostWithProfit = Math.ceil(
        this.totalCostWithOutProfit * this.factorForm.controls.factor.value);
      this.sentStonesArray.splice(deletedStoneIndex, 1);
      this.editStoneMode = false;
      this.addStockStoneForm.patchValue({
        stone: '',
        stone_quantity: '',
        stone_weight: '',
        stone_cost: '',
        stone_setting: ''
      });
      this.sentStonesArray = [];
    }
    if (key === 'deleteImage') {
      this.imageDeleted = true;
      this.imageUploadedDisplay = false;
      (document.getElementById('uploadImage') as HTMLInputElement).value = '';
      this.imagePlaceHolder = 'Stock Image';
      this.addStockForm.value.image = '';
      this.ImageSrc = '../../../assets/default.png';
    }
  }
  /* ----------------------------- Add New Item ----------------------------- */
  onSubmit(form) {
    form.label = this.CategoryCode + '00' + this.categoryLabel;
    form.stones = this.sentStonesArray;
    form.product_date = this.sentProductDate;
    for (const stone of this.sentStonesArray) {
      delete stone.type_name;
      delete stone.total;
    }
    this.imageEncodedCharachter = this.addStockForm.value.image;
    if (this.imageEncodedCharachter.startsWith('/')) {
      this.sentImage =
        'data:image/' +
        this.imageExtention +
        ';base64,' +
        this.addStockForm.value.image;
    } else {
      console.log('Image Without /');
      this.sentImage =
        'data:image/' +
        this.imageExtention +
        ';base64,/' +
        this.addStockForm.value.image;
    }
    form.image =
      'data:image/' +
      this.imageExtention +
      ';base64,' +
      this.addStockForm.value.image;
    form.profit_percent = this.factorForm.controls.factor.value;
    if (form.image == 'data:image/undefined;base64,') {
      form.image = '';
    }
    this.api.post('products', form).subscribe(
      newItem => {
        this.toast.success(
          'Thank you, your' + ' ' + form.label + ' ' + 'was created',
          '!Success'
        );
        this.errorMessage = [];
        this.router.navigate(['/main-stock/stock-list']);
      },
      // tslint:disable-next-line: no-shadowed-variable
      error => {
        this.label = '';
        this.errorMessage = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* --------------------------- Get Factor Number -------------------------- */
  getFactoryNumber(event) {
    this.totalCostWithProfit = Math.ceil(
      this.totalCostWithOutProfit * this.factorForm.controls.factor.value
    );
  }
  /* ------------------------ Get Metal -------------------------- */
  onChangeMetal(event) {
    this.metal_types = event;
    if (event == 1) {
      this.metalFlage = true;
    } else {
      this.metalFlage = false;
    }
  }
  /*--------------------------------- Logout -------------------------------- */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
