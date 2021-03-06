import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbDateService, NbPopoverDirective, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../services/faces.service';
import { AddComponent } from '../add/add.component';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public sanitizer: DomSanitizer,
    private face: FacesService,
    protected dateService: NbDateService<Date>,
    private windowService: NbWindowService,
    public datepipe: DatePipe
  ) { }
  source = new LocalDataSource();

  show: boolean = false;

  ngOnInit(): void {
    this.getSerials()
  }

  getSerials(){
    this.face.getSerials().subscribe(
      res => {
        let dataTable = res['data']
        for(const data of dataTable){
          if(data.expiracy != 'Unlimited'){
            data.expiracy = this.datepipe.transform(data.expiracy, 'MMM dd, yyyy');
          }
        }
        this.source.load(dataTable)
      },
      err => console.error(err)
    )
  }

  updateState:boolean = false
  create() {
    this.windowService.open(AddComponent, { title: `Add new serial`, context: {
        onChange: changes => {
          this.getSerials()
        }
      }
    });
  }

  edit(event) {
    this.windowService.open(AddComponent, { title: `Edit serial` , context: { 
        onChange: changes => {
          this.getSerials()
        },
         id: event.data.serial
      }
    });
  }

  delete(event){
    if(confirm('Do you want to delete this website?')){
      this.face.delSite(event.data.serial).subscribe(
        res => {
          this.getSerials()
        },
        err => {
          console.error(err)
        }
      )
    }
  }

  settings = {
    mode: 'external',
    actions: {
      position: 'right'
    },
      add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmCreate: true,
        },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
    pager: {
      display: true,
      perPage: 10,
    },
    noDataMessage: 'Loading data...',
    columns: {
      serial: {
        title: 'Serial',
        type: 'string',
        filter: false,
      },
      expiracy: {
        title: 'Expiricy',
        type: 'string',
        filter: false,
      },
      owner: {
        title: 'Owner',
        type: 'string',
        filter: false,
      }
    },
  };

}