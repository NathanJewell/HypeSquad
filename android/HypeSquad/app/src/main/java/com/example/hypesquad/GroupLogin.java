package com.example.hypesquad;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;

public class GroupLogin extends AppCompatActivity {

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group_login);
        //Show menu for admin login
        //Start listener for new events

        Intent intent = getIntent();
        String groupName = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
        TextView groupNameTextView = new TextView(this);
        groupNameTextView.setTextSize(40);
        groupNameTextView.setText(groupName);

        ViewGroup layout =(ViewGroup) findViewById(R.id.activity_group_login);
        layout.addView(groupNameTextView);

    }


}
