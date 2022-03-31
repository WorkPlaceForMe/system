import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbCalendarRange, NbDateService, NbWindowRef } from '@nebular/theme';
import { FacesService } from '../../services/faces.service';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  registerForm: FormGroup;
  is_saving : boolean = false;
  submitted = false;
  values:any = {
    name: 'primary',
    owner: 'primary',
  }
  edit : boolean = false;
  @Input() onChange: Function;
  @Input() id: string;
  snippet: string;
  selectedDate: Date;
  range: NbCalendarRange<Date>;
  max: Date;
  fin: Date;
  constructor(
    private formBuilder: FormBuilder,
    protected windowRef: NbWindowRef,
    private facesService: FacesService,
    protected dateService: NbDateService<Date>,
    ) { }

  ngOnInit(): void {
    // if(this.id != undefined){
    //   this.edit = true
    //   this.facesService.getSite(this.id)
    //     .subscribe(
    //       res =>{
    //         console.log(res)
    //         this.registerForm.controls['name'].setValue(res['publ'].name)
    //         this.registerForm.controls['owner'].setValue(res['publ'].nickname)
    //       },
    //       err => console.error(err)
    //   )
    // }
    this.selectedDate =  this.dateService.addDay(this.dateService.today(), 0);
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 59));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    this.range = {
      start: new Date(this.max),
      end: new Date(this.fin),
    };
    this.registerForm = this.formBuilder.group({
      owner: ['', [Validators.required]],
      expiry: ['', ],
    });
  }

  get f() { return this.registerForm.controls; }

  setDate(event){
    this.selectedDate = event
    if (this.selectedDate){
      const start = this.selectedDate;
      this.range = {
        start: new Date(this.max),
        end: new Date(start),
      };
    }
  }

  onSubmit() {
  this.submitted = true;
  this.values = {
    owner: 'primary',
    expiry: 'primary',
  }
  // stop here if form is invalid
  if (this.registerForm.invalid) {
    const controls = this.registerForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            this.values[name] = 'danger'
        }
    }
      return;
  }
  console.log(this.registerForm.value.expiry,new Date(this.max),this.registerForm.value.expiry == this.max)
  if(this.registerForm.value.expiry === '' || new Date(this.registerForm.value.expiry) == new Date(this.max)){
    console.log("inside")
  }

  this.is_saving = true;
  if(this.edit == false){
    this.facesService.saveSite(this.registerForm.value).subscribe(
    res => {
      this.onChange()
      this.windowRef.close();
    },
    err => {
      this.is_saving = false;
      if (err.error.repeated === 'name'){
          this.values.name = 'danger';
          this.registerForm.controls['name'].setErrors({cantMatch: true});
      }
    }
    )
  }else if(this.edit == true){
    this.registerForm.value.id = this.id
    this.facesService.updateSite(this.registerForm.value)
    .subscribe(
    res => {
      this.onChange()
      this.windowRef.close();
    },
    err => console.log(err)
  );
  }

}

}
